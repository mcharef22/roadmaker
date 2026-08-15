import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";

export default function Navigation() {
    return (
        <div className='container-fluid' style={{ marginBottom: '10%' }}>
            <div className='row' style={{ backgroundColor: '#f8f9f3', padding: '15px', }}>
                <div className='col-md-4'>
                    <NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")} style={{ color: 'grey', textDecoration: 'none' }}>
                        <li > Indice</li>
                    </NavLink>
                </div>
                <div className='col-md-4'>
                    <NavLink to="/Resources" className={(nav) => (nav.isActive ? "nav-active" : "")} style={{ color: 'grey', textDecoration: 'none' }}>
                        <li> Ressources</li>
                    </NavLink>
                </div>
                <div className='col-md-4'>
                    <NavLink to="/Quiz" className={(nav) => (nav.isActive ? "nav-active" : "")} style={{ color: 'grey', textDecoration: 'none' }}>
                        <li> Quiz</li>
                    </NavLink>
                </div>
            </div>
        </div>

    )
}
