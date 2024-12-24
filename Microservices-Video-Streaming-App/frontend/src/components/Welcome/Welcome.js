import React from 'react';
import styles from './Welcome.module.css';

const Welcome = () => {
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img src='assetImages/home.jpg' alt="Home" className={styles.image} />
                <div className={styles.text}>
                    <h1>Welcome to our Photo Gallery</h1>
                    <p>"A cloud-based solution for all your photo gallery needs"</p>
                </div>
            </div>
        </div>
        );
};

export default Welcome;
