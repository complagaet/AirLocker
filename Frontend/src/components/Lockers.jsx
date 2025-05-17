import {useState, useEffect} from 'react'
import {useAuth} from "../js/AuthContext.jsx";
import bobatron from "../js/Bobatron.js";
import {HiLockClosed, HiLockOpen, HiTrash} from "react-icons/hi";

function LockerCard(props) {
    const {updateLocker, removeLocker} = useAuth();

    return (
        <div className="locker-card bobatron">
            <div className="flex justify-between gap-[5px]">
                <h1 className="text-2xl semibold">{props.locker.lockerName}</h1>
                <HiTrash className="icon-button" onClick={() => {removeLocker(props.locker._id)}}/>
            </div>
            <br></br>
            <div onClick={() => {updateLocker(props.locker._id, props.locker.lockerName, !props.locker.isLocked)}}>
                {props.locker.isLocked ?
                    <div className="flex items-center gap-[5px]">
                        <HiLockClosed className="icon-button"/>
                        Locked
                    </div> :
                    <div className="flex items-center gap-[5px]">
                        <HiLockOpen className="icon-button"/>
                        Unlocked
                    </div>
                }
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
            <img className="large-icon" src="/new_airlocker.svg" alt/>
            <p className="text-center">Create Your First AirLocker in a Python App</p>
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