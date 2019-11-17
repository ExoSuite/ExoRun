import { ICheckPoint } from "@services/api"
import midpoint from "@turf/midpoint"
import { Position } from "@turf/helpers"

export function interpolateCoordinates(checkpoint: ICheckPoint): Position {
  const point1 = checkpoint.location.coordinates[0][0]
  const point2 = checkpoint.location.coordinates[0][1]
  const point3 = checkpoint.location.coordinates[0][2]
  const point4 = checkpoint.location.coordinates[0][3]

  try {
    console.tron.log(midpoint(midpoint(point1, point3), midpoint(point2, point4)))
  } catch (e) {
    console.tron.logImportant(checkpoint.location.coordinates[0][0])
    console.tron.logImportant(checkpoint.location.coordinates[0][1])
    console.tron.logImportant(checkpoint.location.coordinates[0][2])
    console.tron.logImportant(checkpoint.location.coordinates[0][3])
  }

  return midpoint(midpoint(point1, point3), midpoint(point2, point4)).geometry.coordinates
}
