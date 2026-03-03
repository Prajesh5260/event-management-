export const getEventImage = (eventType = 'Other') => {
  const imageMap = {
    'Wedding': '/images/elegant wedding.jfif',
    'Birthday': '/images/bd party 2.jfif',
    'Anniversary': '/images/elegant wedding.jfif',
    'Corporate': '/images/tech-summit.jpg',
    'Other': '/images/garden events.jpg',
  };
  return imageMap[eventType] || imageMap['Other'];
};
