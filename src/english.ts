const labels: Record<string, string[]> = {
  animals: ['Lion', 'Panda', 'Rabbit', 'Elephant', 'Giraffe', 'Cat', 'Dog', 'Tiger', 'Monkey', 'Zebra', 'Bear', 'Fox', 'Squirrel', 'Koala', 'Hippopotamus', 'Penguin', 'Duck', 'Owl', 'Dolphin', 'Turtle'],
  fruits: ['Apple', 'Banana', 'Orange', 'Grapes', 'Strawberry', 'Watermelon', 'Pear', 'Peach', 'Pineapple', 'Mango', 'Kiwi', 'Cherries', 'Blueberries', 'Lemon', 'Dragon fruit', 'Coconut', 'Persimmon', 'Pomegranate', 'Lychee', 'Cantaloupe'],
  weather: ['Sunny', 'Cloud', 'Rain', 'Snow', 'Rainbow', 'Wind', 'Lightning', 'Fog', 'Cloudy', 'Stars', 'Moon', 'Sunrise', 'Sunset glow', 'Dew', 'Frost', 'Ice', 'Umbrella', 'Rain boots', 'Sun hat', 'Snowman'],
  objects: ['Cup', 'Spoon', 'Bowl', 'Plate', 'Toothbrush', 'Towel', 'Shoes', 'Socks', 'Hat', 'Shirt', 'Pants', 'Schoolbag', 'Ball', 'Toy car', 'Building blocks', 'Picture book', 'Chair', 'Table', 'Bed', 'Clock'],
  hanzi: ['Sun', 'Moon', 'Mountain', 'Water', 'Tree', 'Person', 'Mouth', 'Hand', 'Foot', 'Eye', 'Ear', 'Field', 'Fire', 'Stone', 'Flower', 'Bird', 'Fish', 'Horse', 'Cow', 'Sheep'],
  phrases: ['Drink water', 'Eat a meal', 'Wash your hands', 'Brush your teeth', 'Wash your face', 'Put on your shoes', 'Put on your hat', 'Go to sleep', 'Wake up', 'Read a book', 'Bounce a ball', 'Give me a hug', 'Hello', 'Goodbye', 'Thank you', 'Sorry', 'Walk slowly', 'Put away your toys', 'Look at the flowers', 'Listen to music'],
};

export function englishNumber(value: number): string {
  const small = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  if (value === 100) return 'One hundred';
  if (value < 20) return small[value];
  return ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'][Math.floor(value / 10)] + (value % 10 ? `-${small[value % 10].toLowerCase()}` : '');
}

export function englishLabel(category: string, index: number): string {
  const label = labels[category]?.[index];
  if (!label) throw new Error(`Missing English label: ${category}/${index}`);
  return label;
}
