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

with patch.object(sys, 'argv', ['generate-audio.py', '--check', '--english-card', 'letters-A']), patch.object(audio, 'generate') as generate:
    try:
        audio.main()
        raise AssertionError('Alphabet recordings must not be duplicated as English explanation jobs')
    except SystemExit as error:
        assert error.code == 2
    generate.assert_not_called()

approved = ['hanzi-19', 'phrases-01', 'phrases-02', 'phrases-03', 'phrases-04']
with patch.object(sys, 'argv', ['generate-audio.py', '--check', '--mandarin-cards', *approved]), patch.object(audio, 'generate') as generate, patch.object(audio, 'run_batch') as batch:
    audio.main()
    assert [call.args[0]['id'] for call in generate.call_args_list] == approved
    assert all(call.args[1:] == (None, True) for call in generate.call_args_list)
    assert all(call.args[0]['category'] not in ('numbers', 'letters') for call in generate.call_args_list)
    batch.assert_not_called()

for identifiers in [approved + ['phrases-05'], ['hanzi-19', 'hanzi-19'], ['numbers-1'], ['letters-A'], ['unknown']]:
    with patch.object(sys, 'argv', ['generate-audio.py', '--check', '--mandarin-cards', *identifiers]), patch.object(audio, 'generate') as generate:
        try:
            audio.main()
            raise AssertionError('Invalid Mandarin selection must fail before generation')
        except SystemExit as error:
            assert error.code == 2
        generate.assert_not_called()

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    config = root / '.config/his.fm/config.json'
    config.parent.mkdir(parents=True)
    config.write_text(json.dumps({'speechKeys': {'gemini': 'test-only'}}))
    with patch.object(sys, 'argv', ['generate-audio.py', '--mandarin-cards', *approved]), patch.object(audio, 'ROOT', root), patch.object(audio.Path, 'home', return_value=root), patch.object(audio.subprocess, 'check_output', return_value=json.dumps([{'id': identifier, 'category': 'phrases'} for identifier in approved]).encode()), patch.object(audio.shutil, 'which', return_value='/mock/ffmpeg'), patch.object(audio, 'generate') as generate, patch.object(audio, 'run_batch') as batch:
        audio.main()
        assert [call.args[0]['id'] for call in generate.call_args_list] == approved
        assert all(call.args[1:] == ('test-only', False) for call in generate.call_args_list)
        batch.assert_not_called()
        assert not (root / 'src/audio-manifest.json').exists()
        generate.reset_mock()
        generate.side_effect = ValueError('HTTP 429')
        try:
            audio.main()
            raise AssertionError('Provider errors must stop the selected batch')
        except ValueError:
            pass
        assert generate.call_count == 1

with TemporaryDirectory() as temporary:
    root = Path(temporary)
    (root / 'design/audio').mkdir(parents=True)
    (root / 'artifacts/audio-schedule').mkdir(parents=True)
    (root / 'design/audio/saved.wav').write_bytes(b'fixture')
    (root / 'design/audio/saved.json').write_text(json.dumps({'origin': 'generated'}))
    items = [{'id': 'phrases-01', 'category': 'phrases', 'text': 'ZH phrase', 'englishText': 'EN phrase explanation'},
             {'id': 'animals-01', 'category': 'animals', 'text': 'ZH animal', 'englishText': 'EN animal explanation'},
             {'id': 'numbers-1', 'category': 'numbers'}, {'id': 'letters-A', 'category': 'letters'}]
    with patch.object(audio, 'ROOT', root):
        jobs = audio.bilingual_jobs(items)
        assert [item['id'] for item in jobs] == ['animals-01', 'phrases-01', 'en/animals-01', 'en/phrases-01']
        assert jobs[-1]['text'] == 'EN phrase explanation' and jobs[-1]['language'] == 'en'
        assert audio.remaining_requests() == 89
        for i in range(87):
            audio.reserve_request(f'fixture-{i}')
        assert audio.remaining_requests() == 2
        with patch.object(audio, 'generate', side_effect=lambda item, *_: audio.reserve_request(item['id'])) as generate:
            audio.run_bilingual_day(items, 'test-only', False)
            assert [call.args[0]['id'] for call in generate.call_args_list] == ['animals-01', 'phrases-01']
            generate.reset_mock()
            audio.run_bilingual_day(items, 'test-only', False)
            generate.assert_not_called()
        try:
            audio.reserve_request('over-budget')
            raise AssertionError('Daily request budget must persist across invocations')
        except ValueError:
            pass
        assert not (root / 'src/audio-manifest.json').exists()
        with patch.object(audio, 'remaining_requests', return_value=4), patch.object(audio, 'generate', side_effect=ValueError('HTTP 429')) as generate:
            try:
                audio.run_bilingual_day(items, 'test-only', False)
                raise AssertionError('Bilingual generation must stop on the first provider error')
            except ValueError:
                pass
            assert generate.call_count == 1
        with patch.object(audio, 'generate') as generate:
            audio.run_bilingual_day(items, None, True)
            generate.assert_not_called()

print('检查通过：冷却、失败停止、文件复用、五条隔离、双语中文优先、排除数字字母、持久化每日请求上限。')
