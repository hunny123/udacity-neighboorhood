import React, { Component } from 'react';
import PropTypes from 'prop-types'
class ListLocations extends Component {
	static propTypes = {
    map: PropTypes.object.isRequired,
    markers: PropTypes.array.isRequired,
    mapMarkers: PropTypes.array.isRequired,
   createMarker: PropTypes.func.isRequired,
   removeMarkers: PropTypes.func.isRequired,
    createinfoWindow: PropTypes.func.isRequired
  }
	state = {
    query: '',
  }
  updateQuery = (event) => { //update query
    this.setState({query: event.target.value})

  }
	render() {
		
    const { map, markers, mapMarkers, infowindow ,createMarker,createinfoWindow } = this.props
    const { query } = this.state
    const filteredMapMarkers = mapMarkers.filter(mapMarker => mapMarker.title.toUpperCase().includes(query.toUpperCase()))
    const filteredMarkers = markers.filter(marker => marker.title.toUpperCase().includes(query.toUpperCase()))
    return (
      <div className='list-locations'>
        <form className='form-inline' onSubmit={(e) => {this.props.removeMarkers(mapMarkers);createMarker(map, filteredMarkers, infowindow); e.preventDefault()}} >
          <input className='form-control ' aria-label='search' type='text' value={query} placeholder='Search location' onChange={this.updateQuery} />
          <input className='btn form-control ml-2 btn-primary my-sm-0' type='submit' value='Filter' />
        </form>
        <ul className="mt-3">
          {filteredMapMarkers.map(mapMarker => (
            <li key={mapMarker.title} className="mt-2 btn-outline-success p-2" tabIndex='0' onClick={() => createinfoWindow(mapMarker, infowindow, map)} >
              {mapMarker.title}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default ListLocations
