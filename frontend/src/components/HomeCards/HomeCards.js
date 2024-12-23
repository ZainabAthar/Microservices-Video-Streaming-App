import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import styles from './HomeCards.module.css'


export default function HomeCards() {
    return (
        <div style={{ margin: '2rem', padding: '1rem', color: '#fff' }}>

            <h1 className={styles.homeCardsTitle}>What We Offer</h1>
            
            <CardGroup>
                <Card className={styles.card}>
                    <Card.Img variant="top" src="assetImages/cardimages/access.jpg" className={styles.cardImages}/>
                    <Card.Body>
                        <Card.Title>Access files anytime, anywhere</Card.Title>
                        <Card.Text>
                            Instantly access your files from all your computers, mobile devices, and the web. Whether you're working from home, the office, or the most inspiring places on the planet.
                        </Card.Text>
                    </Card.Body>
                </Card >
                <Card className={styles.card}>
                    <Card.Img variant="top" src="assetImages/cardimages/backups.jpg" className={styles.cardImages}/>
                    <Card.Body>
                        <Card.Title>Enjoy Complimentary Storage and Bandwidth!</Card.Title>
                        <Card.Text>
                        As a valued user, you get 10MB of complimentary storage space to save your images securely. Additionally, relish the freedom of 25MB in daily bandwidth to effortlessly share and download your visual tales.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className={styles.card}>
                    <Card.Img variant="top" src="assetImages/cardimages/privacy.jpg" className={styles.cardImages}/>
                    <Card.Body>
                        <Card.Title>Secure & Compliant</Card.Title>
                        <Card.Text>
                        Our groundbreaking privacy protection features, enterprise-grade infrastructure, and compliance with widely accepted security and privacy regulations worldwide ensure the safety of your data.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    );
}