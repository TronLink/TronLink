import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

import { TronIcon } from '../../../Icons.js';

import AccountView from './AccountView';

class Header extends Component {
    leftIconCheck() {
        if (this.props.leftIcon) {
            return (
                <NavLink className="navbarIconLeft" to={this.props.leftIconRoute}>
                    { this.props.leftIconImg }
                </NavLink>
            );
        }
        return (
            <div className="navbarIconLeft disabled"></div>
        );
    }

    rightIconCheck() {
        if (this.props.rightIcon) {
            return (
                <NavLink className="navbarIconRight" to={this.props.rightIconRoute}>
                    { this.props.rightIconImg }
                </NavLink>
            );
        }
        return (
            <div className="navbarIconRight disabled"></div>
        );
    }

    render() {
        return (
            <div className="header">
                <div className="navbarContainer">
                    { this.leftIconCheck() }

                    <div className="navbarHeader">
                        <div className="navbarHeaderMain">
                            <span>{this.props.navbarTitle}</span>
                        </div>
                        <div className="navbarHeaderSub">
                            <span>{this.props.navbarLabel}</span>
                        </div>
                        <TronIcon />
                    </div>

                    { this.rightIconCheck() }
                </div>
                { this.props.children }
            </div>
        );
    }
}

export default Header;
