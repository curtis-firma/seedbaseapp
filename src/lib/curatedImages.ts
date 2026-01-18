// Curated images for feed content variety
// Topic-matched images from Unsplash - REAL photos only

export const curatedImages = {
  water: [
    'https://images.unsplash.com/photo-1541544741404-b7fba7cfc8ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1581578017426-04fbc2b3f2f1?w=800&h=600&fit=crop',
  ],
  healthcare: [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1631815588090-d4bfec5b1b89?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
  ],
  education: [
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop',
  ],
  community: [
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop',
  ],
  children: [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&h=600&fit=crop',
  ],
  agriculture: [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
  ],
  faith: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519491050282-cf00c82424eb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800&h=600&fit=crop',
  ],
  missions: [
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
  ],
};

// Real people avatars from Unsplash
export const avatars = {
  diverse: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
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
  if (lowerName.includes('child') || lowerName.includes('youth') || lowerName.includes('kid') || lowerName.includes('mentor')) return 'children';
  if (lowerName.includes('farm') || lowerName.includes('agriculture') || lowerName.includes('crop') || lowerName.includes('food')) return 'agriculture';
  if (lowerName.includes('church') || lowerName.includes('faith') || lowerName.includes('christ') || lowerName.includes('king')) return 'faith';
  if (lowerName.includes('mission')) return 'missions';
  return 'community';
}
