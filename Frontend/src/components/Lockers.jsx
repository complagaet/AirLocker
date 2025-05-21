import {useState, useEffect} from 'react'
import {useAuth} from "../js/AuthContext.jsx";
import bobatron from "../js/Bobatron.js";
import {HiLockClosed, HiLockOpen, HiTrash} from "react-icons/hi";

function LockerButton(props) {
    return <div className="locker-button-wrapper bobatron" onClick={props.onClick}>
        <img className="locker-button" src={props.isLocked ? "/locked.svg" : "/unlocked.svg"}/>
        <p>{props.isLocked ? "Locked" : "Unlocked"}</p>
    </div>
}

function LockerCard(props) {
    const {updateLocker, removeLocker} = useAuth();

    return (
        <div className={`locker-card bobatron ${props.locker.isLocked ? "" : "locker-card-unlocked"}`}>
            <div className="flex justify-between gap-[5px]">
                <h1 className="text-2xl semibold">{props.locker.lockerName}</h1>
                <HiTrash className="icon-button" onClick={() => {removeLocker(props.locker._id)}}/>
            </div>
            <br></br>
            <div className="flex justify-center clickable">
                <LockerButton onClick={() => {updateLocker(props.locker._id, props.locker.lockerName, !props.locker.isLocked)}} isLocked={props.locker.isLocked}/>
            </div>
            <br></br>
            <p style={{color: "#373737"}}>Last update: {new Date(props.locker.updatedAt).toLocaleString("ru-RU")}</p>
            <p style={{color: "#373737"}}>ID: {props.locker._id}</p>
        </div>
    )
}

function Lockers(props) {
    const {user} = useAuth();

    useEffect(() => {
        bobatron.scanner()
    }, [user])

    if (!user?.lockers || user.lockers.length === 0) {
        return <div className="center-container flex-col gap-[10px]">
            <img className="large-icon" src="/new_airlocker.svg" />
            <p className="text-center">
                Create Your First Locker<br />
                in a <a className="text-blue-600 hover:text-blue-800 underline" href="https://github.com/complagaet/AirLocker">AirLockerPy</a> App
            </p>
        </div>;
    }

    return (
        <div className="flex flex-wrap gap-[15px]">
            {user.lockers.map((locker) => (
                <LockerCard locker={locker} key={locker._id} />
            ))}
        </div>
    );
}

export default Lockers;