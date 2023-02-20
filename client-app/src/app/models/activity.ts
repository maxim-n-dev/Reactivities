export interface Activity {
  id:          string;
  title:       string;
  category:    string;
  date:        Date | null;
  description: string;
  city:        string;
  venue:       string;
}
