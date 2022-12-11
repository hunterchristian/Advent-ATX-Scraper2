interface Event {
  Name: string;
  StartDate: string;
  EndDate: string | null;
  StartTime: string | null;
  EndTime: string | null;
  Location: string;
  Description: string;
  Cost: number;
  EventHost: string;
  OriginalURL: string;
  Image: string;
  IdealAudience: string[];
}

export default Event;
