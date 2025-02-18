import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";

const SwipeableCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = [
    { id: 1, content: "Item 1" },
    { id: 2, content: "Item 2" },
    { id: 3, content: "Item 3" },
    { id: 4, content: "Item 4" },
  ];

  const handlers = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1), // Swipe left to go to the next item
    onSwipedRight: () => updateIndex(activeIndex - 1), // Swipe right to go to the previous item
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = carouselItems.length - 1; // Loop to the last item if at the beginning
    } else if (newIndex >= carouselItems.length) {
      newIndex = 0; // Loop to the first item if at the end
    }
    setActiveIndex(newIndex);
  };

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      <div
        {...handlers}
        style={{
          display: "flex",
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {carouselItems.map((item) => (
          <div
            key={item.id}
            style={{
              minWidth: "100%",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "24px",
            }}
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => updateIndex(index)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              border: "none",
              margin: "0 5px",
              backgroundColor: activeIndex === index ? "#333" : "#ccc",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableCarousel;
