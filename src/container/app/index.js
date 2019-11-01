import React from 'react'
import { Card, TextField, LinearProgress } from '@material-ui/core'
import { LOADING_DATA } from '../../actions'
import { connect } from 'react-redux'
import { Autocomplete } from '@material-ui/lab'
import './index.css'
class Appy extends React.Component {


    constructor(props) {
        super(props)

        props.dispatch({ type: LOADING_DATA })
        this.state = {
            person: null
        }

    }


    handleOnChange = (e) => {

        this.setState({ person: e.target.textContent })
    }

    render() {
        let { person } = this.state

        let { loading, error, people, peopleByName } = this.props
        return (
            <div className="container">
                <Card className="card" raised>
                    {loading && <LinearProgress />}
                    {error &&
                        <div>
                            There is an error somehow,<br />
                            check your internet connection perhaps.<br />
                            refresh the page to start over

                        </div>}
                    <div className="content">
                        {!error && <Autocomplete
                            options={people}
                            getOptionLabel={option => option.name}
                            style={{ width: 300, zIndex: 2000, background: 'white' }}
                            onChange={this.handleOnChange}
                            renderInput={params => (
                                <TextField {...params}
                                    disabled={loading || error}
                                    label="Search potential enemies"
                                    variant="outlined" fullWidth />
                            )}
                        />}

                    </div>
                    {person && <pre>
                        {JSON.stringify(peopleByName[person], null, 2)}
                    </pre>}

                </Card>
            </div>
        )
    }
}


export const App = connect(state => ({
    loading: state.people.loading,
    error: state.people.error,
    people: state.people.people,
    peopleByName: state.people.peopleByName
}))(Appy)