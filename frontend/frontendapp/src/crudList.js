import * as React from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
// import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class crudList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {cruds: []};
        // this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/api/getCRUDList')
            .then(response => response.json())
            .then(data => this.setState({cruds: data}));
    }
    // async remove(id) {
    //     await fetch(`/cruds/${id}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(() => {
    //         let updatedcruds = [...this.state.cruds].filter(i => i.id !== id);
    //         this.setState({cruds: updatedcruds});
    //     });
    // }
    
    render() {
        const {cruds, isLoading} = this.state;
    
        if (isLoading) {
            return <p>Loading...</p>;
        }
    
        const crudList = cruds.map(crud => {
            return <tr key={crud.id}>
                <td style={{whiteSpace: 'nowrap'}}>{crud.name}</td>
                <td>{crud.profession}</td>
                <td>
                    {/* <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/cruds/" + crud.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(crud.id)}>Delete</Button>
                    </ButtonGroup> */}
                </td>
            </tr>
        });
    
        return (
            <div>
                {/* <AppNavbar/> */}
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/cruds/new">Add crud</Button>
                    </div>
                    <h3>cruds</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Name</th>
                            <th width="30%">profession</th>
                            <th width="40%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {crudList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}
export default crudList;