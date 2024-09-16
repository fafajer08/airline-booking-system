import React, { useState, useRef, useEffect } from 'react';
import '../styles/carousel.css';

const Cards = ({ date, price, isSelected, onClick }) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    });

    const formattedPrice = price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const cardClass = isSelected ? 'card selected' : 'card';

    // console.log(`Rendering card for ${formattedDate}: isSelected =`, isSelected);

    return (
        <div className={cardClass} onClick={onClick}>
            <p>{formattedDate}</p>
            <p>PHP {formattedPrice}</p>
        </div>
    );
};

const Carousel = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const carouselRef = useRef(null);

    const cardsData = [
        { date: new Date(2024, 8, 1), price: 10000.0 },
        { date: new Date(2024, 8, 2), price: 1500.0 },
        { date: new Date(2024, 8, 3), price: 2000.0 },
        { date: new Date(2024, 8, 4), price: 1250.0 },
        { date: new Date(2024, 8, 5), price: 1300.0 },
        { date: new Date(2024, 8, 6), price: 1350.0 },
        { date: new Date(2024, 8, 7), price: 1400.0 },
        { date: new Date(2024, 8, 8), price: 1450.0 },
        { date: new Date(2024, 8, 9), price: 1500.0 },
        { date: new Date(2024, 8, 10), price: 1100.0 },
        { date: new Date(2024, 8, 11), price: 1150.0 },
        { date: new Date(2024, 8, 12), price: 1200.0 },
        { date: new Date(2024, 8, 13), price: 1250.0 },
        { date: new Date(2024, 8, 14), price: 1300.0 },
    ];

    const handleCardClick = (date) => {
        const dateTimestamp = date.getTime();
        console.log('Clicked card timestamp:', dateTimestamp);

        setSelectedCard((prevSelectedCard) => {
            if (prevSelectedCard === dateTimestamp) {
                console.log('Deselecting card with timestamp:', dateTimestamp);
                return null;
            } else {
                console.log('Selecting card with timestamp:', dateTimestamp);
                return dateTimestamp;
            }
        });
    };

    useEffect(() => {
        console.log('Selected card state updated:', selectedCard);
    }, [selectedCard]);

    return (
        <div className="carousel-container">
            <button className="scroll-button left" onClick={() => carouselRef.current.scrollBy({ left: -150, behavior: 'smooth' })}>
                &#8249;
            </button>
            <div className="carousel" ref={carouselRef}>
                {cardsData.map((card, index) => {
                    const cardTimestamp = card.date.getTime();
                    const isSelected = selectedCard === cardTimestamp;

                    {/* console.log(`Comparing selectedCard (${selectedCard}) with card (${cardTimestamp}):`, isSelected); */}

                    return (
                        <Cards
                            key={index}
                            date={card.date}
                            price={card.price}
                            isSelected={isSelected} // Compare timestamps
                            onClick={() => handleCardClick(card.date)}
                        />
                    );
                })}
            </div>
            <button className="scroll-button right" onClick={() => carouselRef.current.scrollBy({ left: 150, behavior: 'smooth' })}>
                &#8250;
            </button>
        </div>
    );
};

export default Carousel;
