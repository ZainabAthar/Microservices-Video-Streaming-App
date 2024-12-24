import React from 'react';
import styles from './About.module.css'; // Import the CSS module
import { useNavigate } from "react-router-dom";


const About = () => {
    const navigate = useNavigate();


    const joinHandler = () => {
        navigate("/login");
      };

      const signinHandler = () => {
        navigate("/register");
      }

    return (

        <>

            <div className={styles.wrapper}>
            <h1
                style={{
                    margin: '.5rem 2rem',
                    padding: '.5rem 2rem',
                    color: 'white',
                    // fontSize: '4rem
                }}
            >About Us</h1>
            <div className={styles['about-section']}>
                <div className={styles['about-content']}>
                    <p>
                        We are a photo gallery website that offers cloud storage for photos. 
                        Our platform is more than just a storage space. It's a curated gallery for your life's moments. 
                        We understand how precious each memory is, and we've built our services to honor that. 
                        Store your precious memories securely with us!
                    </p>
                    <div className={styles['buttons']}>
                        <button className={styles['btn']} onClick={joinHandler}>Join Now</button>
                        <button className={styles['btn']} onClick={signinHandler}>Sign In</button>
                    </div>
                </div>
                <div className={styles['about-image']}>
                    <img src="assetImages/about.jpg" alt="About Us" style={{
                    }} />
                </div>
            </div>

            </div>
        </>
    );
};

export default About;
