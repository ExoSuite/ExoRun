import MapboxGL from "@react-native-mapbox-gl/maps"

/**
 * here we declare static constants for mapbox-gl
 * @class ReactViroConfig
 */
export class MapboxGLConfig {
  public static readonly API_KEY = "pk.eyJ1IjoiZXhvc3VpdGVwcm9qZWN0IiwiYSI6ImNqcGlvamw0ZTE5aXczd3A1M3A2OWJ0NDUifQ.XW3FK5hUlCXHQrrhR3h3Cg"
  public static readonly STYLE_URL = "mapbox://styles/exosuiteproject/cjx0fn5vn16aw1cpiq39dg85c"
}

MapboxGL.setAccessToken(MapboxGLConfig.API_KEY)
