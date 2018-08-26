import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Button from 'components/Button';
import { ArrowLeftIcon } from 'components/Icons';
import './PrivateKey.css';

class PrivateKey extends Component {
    state = {
        privateKey: ''
    }

    handlePrivateKeyChange({ target: { value: privateKey }}) {
        this.setState({ privateKey });
    }

    render() {
        return (
            <div className="import">
                <NavLink to="/main/import" className="importBackButton"><ArrowLeftIcon /></NavLink>
                <div className="importHeader">
                    <FormattedMessage id='import.header' />
                </div>
                <div className="importText">
                    <FormattedMessage id='import.body' />
                </div>
                <input 
                    placeholder="Enter Private Key to Import a Wallet..."
                    className="textInput"
                    type="text"
                    value={ this.state.privateKey }
                    onChange={ event => this.handlePrivateKeyChange(event) }
                />
                <Button type={ 'black' } style={{ marginTop: '20px' }}>
                    <FormattedMessage id='import.button' />
                </Button>
            </div>
        );
    }
}

export default PrivateKey;