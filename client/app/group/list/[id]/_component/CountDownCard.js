"use client";
import React from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
const Completionist = () => <h5>已截止</h5>;

    // Renderer callback with condition
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {
            // Render a countdown
            return (
                <>
                    <div className="time-card">
                        <div className="color-secondary-deep number">{days}</div>
                        <p className="m-0">日</p>
                    </div>
                    <div className="time-card">
                        <div className="color-secondary-deep number">{hours}</div>
                        <p className="m-0">時</p>
                    </div>
                    <div className="time-card">
                        <div className="color-secondary-deep number">{minutes}</div>
                        <p className="m-0">分</p>
                    </div>
                    <div className="time-card">
                        <div className="color-secondary-deep number">{seconds}</div>
                        <p className="m-0">秒</p>
                    </div>
                </>
            );
        }
    };
export default function CountDownCard({date}) {
    return <Countdown date={date} renderer={renderer} />;
}
