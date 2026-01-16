// Curated images for feed content variety
// Topic-matched images from Unsplash

export const curatedImages = {
  water: [
    'https://images.unsplash.com/photo-1541544741404-b7fba7cfc8ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
  ],
  healthcare: [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1631815588090-d4bfec5b1b89?w=800&h=600&fit=crop',
  ],
  education: [
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop',
  ],
  community: [
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
  ],
  children: [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=800&h=600&fit=crop',
  ],
  agriculture: [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
  ],
};

export const avatars = {
  diverse: [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  ],
};

export function getRandomImage(category: keyof typeof curatedImages): string {
  const images = curatedImages[category];
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomAvatar(): string {
  return avatars.diverse[Math.floor(Math.random() * avatars.diverse.length)];
}

// Map mission/seedbase names to image categories
export function getCategoryFromName(name: string): keyof typeof curatedImages {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('water') || lowerName.includes('well')) return 'water';
  if (lowerName.includes('health') || lowerName.includes('clinic') || lowerName.includes('medical')) return 'healthcare';
  if (lowerName.includes('school') || lowerName.includes('education') || lowerName.includes('classroom')) return 'education';
  if (lowerName.includes('child') || lowerName.includes('youth') || lowerName.includes('kid')) return 'children';
  if (lowerName.includes('farm') || lowerName.includes('agriculture') || lowerName.includes('crop')) return 'agriculture';
  return 'community';
}
