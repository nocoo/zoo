import importlib.util
import json
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('audio', Path(__file__).with_name('generate-audio.py'))
audio = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audio)

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    state = root / 'state.json'
    calls = []
    action = lambda: calls.append(True) or False
    audio.scheduled_run(action, state, 100)
    audio.scheduled_run(action, state, 101)
    assert len(calls) == 1
    audio.scheduled_run(lambda: True, state, 100 + 23 * 3600)
    audio.scheduled_run(action, state, 100 + 48 * 3600)
    assert len(calls) == 1 and json.loads(state.read_text())['status'] == 'complete'
    state.unlink()
    def fail():
        raise ValueError('HTTP 429')
    try:
        audio.scheduled_run(fail, state, 100)
    except ValueError:
        pass
    assert json.loads(state.read_text())['status'] == 'failed'
    audio.scheduled_run(action, state, 101)
    assert len(calls) == 1
    (root / 'design/audio').mkdir(parents=True)
    (root / 'src').mkdir()
    (root / 'design/audio/saved.json').write_text('{}')
    items = [{'id': identifier} for identifier in ['new-1', 'new-2', 'saved']]
    with patch.object(audio, 'ROOT', root), patch.object(audio, 'generate', side_effect=lambda item, *_: (item['id'], '/audio/' + item['id'])) as generate:
        assert not audio.run_batch(items, None, False, 1)
        assert [call.args[0]['id'] for call in generate.call_args_list] == ['new-1', 'saved']
        assert not (root / 'src/audio-manifest.json').exists()
        assert audio.run_batch(items, None, False, 3)
        assert len(json.loads((root / 'src/audio-manifest.json').read_text())) == 3

with patch.object(sys, 'argv', ['generate-audio.py', '--check', '--english-card', 'animals-01']), patch.object(audio, 'generate') as generate, patch.object(audio, 'run_batch') as batch:
    audio.main()
    generate.assert_called_once()
    item, key, check_only = generate.call_args.args
    assert item['id'] == 'en/animals-01' and item['language'] == 'en'
    assert item['text'] == 'Lion. The lion has a fluffy mane around his neck, like a little scarf.'
    assert key is None and check_only
    batch.assert_not_called()

print('定时检查通过：冷却、完成后停止、失败后等待、单轮上限、已完成文件复用、单条英文隔离。')
