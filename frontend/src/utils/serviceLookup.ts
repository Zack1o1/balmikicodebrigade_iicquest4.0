import SERVICES from "../data/services";

export function getServiceName(serviceId: string): string {
  const service = SERVICES.find((s) => s.id === serviceId);
  return service?.name || serviceId;
}

export function getServiceTime(serviceId: string): string {
  const service = SERVICES.find((s) => s.id === serviceId);
  return service?.time || "-";
}

export function getServiceFee(serviceId: string): string {
  const service = SERVICES.find((s) => s.id === serviceId);
  return service?.fee || "-";
}
