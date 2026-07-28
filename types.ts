
export type Campus = {
  id: string;
  name: string;
  location: string;
  status: 'live' | 'soon';
};

export type Feature = {
  title: string;
  description: string;
  icon: string;
};

export type Stat = {
  value: string;
  label: string;
  color: string;
};
