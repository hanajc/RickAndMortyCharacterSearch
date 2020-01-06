import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Navbar, Spinner } from 'react-bootstrap';
import axios from 'axios';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  };

  handleSubmit = async () => {
    this.setState({ ...this.state, characters: null, error: null, loading: true })
    try {
      var response = await axios.get('https://rickandmortyapi.com/api/character/?name=' + this.state.value)
      var arr = response.data.results

      while (response.data.info.next !== "") {
        response = await axios.get(response.data.info.next)
        arr = arr.concat(response.data.results)
      }

      arr.sort((a, b) => {
        var x = a.name; var y = b.name;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });

      this.setState({ ...this.state, characters: arr, loading: false })
    } catch (err) {
      console.log(err)
      this.setState({ ...this.state, error: "Error getting characters. Please try again.", loading: false })
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div>
        <label>
          Search Name
          <input type="text" name="value" value={this.state.value} onChange={this.handleChange} />
        </label>
        <Button variant="outline-secondary" disabled={this.state.loading} onClick={this.handleSubmit}>Submit</Button>

        {this.state.error &&
          <div>{this.state.error}</div>
        }

        {this.state.loading &&
          <Spinner animation="border" variant="secondary" />
        }

        {this.state.characters &&
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Character ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Species</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {this.state.characters.map((character) => {
                return (<tr key={character.id}>
                  <td>{character.id}</td>
                  <td>{character.name}</td>
                  <td>{character.status}</td>
                  <td>{character.species}</td>
                  <td>{character.location.name}</td>
                </tr>
                )
              })}
            </tbody>
          </Table>
        }
      </div>
    );
  }
}

class SearchDisplay extends React.Component {
  render() {
    return (
      <div className="SearchDisplay">
        <Navbar className='NavBar' bg="dark" variant="dark">
          <label className='headerLabel'>Rick and Morty Character Search</label>
        </Navbar>
        <div className="SearchBar">
          <Search />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <SearchDisplay />,
  document.getElementById('root')
);
                                    