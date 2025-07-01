export async function fetchMealImage(query) {
  const spoonacularKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;
  if (!query) return 'https://via.placeholder.com/300x200?text=No+Image';

  // 1. Try Spoonacular
  if (spoonacularKey) {
    try {
      const url = `https://api.spoonacular.com/food/menuItems/search?query=${encodeURIComponent(query)}&number=1&apiKey=${spoonacularKey}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.menuItems?.length && json.menuItems[0].image) {
        return json.menuItems[0].image;
      }
    } catch (e) {
      // Continue to fallback
    }
  }

  // 2. Fallback to Pixabay
  if (pixabayKey) {
    try {
      const url = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(query)}&image_type=photo&category=food&per_page=3`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.hits?.length && json.hits[0].webformatURL) {
        return json.hits[0].webformatURL;
      }
    } catch (e) {
      // Continue to fallback
    }
  }

  // 3. Fallback image
  return 'https://via.placeholder.com/300x200?text=No+Image';
} 