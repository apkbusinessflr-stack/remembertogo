export function placeSchema(place:{name:string; lat:number; lng:number; country:string}){
  return { "@context":"https://schema.org", "@type":"TouristAttraction", name:place.name,
    geo:{ "@type":"GeoCoordinates", latitude: place.lat, longitude: place.lng },
    address:{ "@type":"PostalAddress", addressCountry: place.country } };
}
