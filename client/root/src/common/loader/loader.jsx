import React from 'react';
import './loader.scss';

function Loader() {
    return (
        <div className="loader-overlay">
            <div className="loader-box">
                <div className="spinner" />
            </div>
        </div>
    );
}

export default Loader;