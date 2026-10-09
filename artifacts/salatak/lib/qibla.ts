const KAABA = { latitude: 21.422487, longitude: 39.826206 };

export function getQiblaBearing(latitude: number, longitude: number): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const toDegrees = (radians: number) => (radians * 180) / Math.PI;
  const latitudeRadians = toRadians(latitude);
  const kaabaLatitudeRadians = toRadians(KAABA.latitude);
  const longitudeDelta = toRadians(KAABA.longitude - longitude);
  const bearing = toDegrees(
    Math.atan2(
      Math.sin(longitudeDelta),
      Math.cos(latitudeRadians) * Math.tan(kaabaLatitudeRadians) -
        Math.sin(latitudeRadians) * Math.cos(longitudeDelta),
    ),
  );
  return (bearing + 360) % 360;
}

export function getRelativeBearing(qiblaBearing: number, heading: number): number {
  return (qiblaBearing - heading + 360) % 360;
}
