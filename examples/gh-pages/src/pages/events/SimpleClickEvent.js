import { default as omit } from "lodash/omit";

import { default as React, Component } from "react";

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

/*
 * https://developers.google.com/maps/documentation/javascript/examples/event-simple
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class SimpleClickEvent extends Component {

  static defaultProps = {
    initialCenter: { lat: -25.363882, lng: 131.044922 },
  }

  state = {
    zoom: 4,
    center: this.props.initialCenter,
  }

  handleMarkerClick() {
    this.setState({
      zoom: 8,
    });
  }

  handleMapCenterChanged() {
    const newPos = this._map.getCenter();
    if (newPos.equals(new google.maps.LatLng(this.props.initialCenter))) {
      // Notice: Check newPos equality here,
      // or it will fire center_changed event infinitely
      return;
    }
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    this._timeoutId = setTimeout(() => {
      this.setState({ center: this.props.initialCenter });
    }, 3000);

    this.setState({
      // Because center now is a controlled variable, we need to set it to new
      // value when "center_changed". Or in the next render it will use out-dated
      // state.center and reset the center of the map to the old location.
      // We can never drag the map.
      center: newPos,
    });
  }

  render() {
    const { zoom, center } = this.state;

    return (
      <GoogleMapLoader
        containerElement={
          <div
            {...omit(this.props, [`initialCenter`])}
            style={{
              height: `100%`,
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={map => { this._map = map; }}
            zoom={zoom}
            center={center}
            onCenterChanged={::this.handleMapCenterChanged}
          >
            <Marker
              defaultPosition={center}
              title="Click to zoom"
              onClick={::this.handleMarkerClick}
            />
          </GoogleMap>
        }
      />
    );
  }
}
