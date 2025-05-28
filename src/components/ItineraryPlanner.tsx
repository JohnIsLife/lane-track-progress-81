
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TripForm from "./TripForm";
import ItineraryDisplay from "./ItineraryDisplay";

export interface TripData {
  destinations: string[];
  startDate: Date;
  endDate: Date;
  days: number;
  includeFlights: boolean;
  budget: number;
  currency: string;
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  estimatedCost: number;
  type: "flight" | "accommodation" | "activity" | "meal" | "transport";
}

const ItineraryPlanner = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateItinerary = async (data: TripData) => {
    setIsGenerating(true);
    setTripData(data);
    
    // Simulate API call to generate itinerary
    setTimeout(() => {
      const sampleItinerary: ItineraryItem[] = [
        {
          id: "1",
          day: 1,
          time: "09:00",
          activity: "Arrive at Tokyo Haneda Airport",
          location: "Tokyo",
          estimatedCost: 0,
          type: "flight"
        },
        {
          id: "2",
          day: 1,
          time: "12:00",
          activity: "Check-in at Hotel",
          location: "Shibuya, Tokyo",
          estimatedCost: 150,
          type: "accommodation"
        },
        {
          id: "3",
          day: 1,
          time: "14:00",
          activity: "Visit Senso-ji Temple",
          location: "Asakusa, Tokyo",
          estimatedCost: 0,
          type: "activity"
        },
        {
          id: "4",
          day: 1,
          time: "18:00",
          activity: "Dinner at Traditional Ramen Shop",
          location: "Shibuya, Tokyo",
          estimatedCost: 25,
          type: "meal"
        },
        {
          id: "5",
          day: 2,
          time: "08:00",
          activity: "Breakfast at Hotel",
          location: "Shibuya, Tokyo",
          estimatedCost: 20,
          type: "meal"
        },
        {
          id: "6",
          day: 2,
          time: "10:00",
          activity: "Visit Tokyo Skytree",
          location: "Sumida, Tokyo",
          estimatedCost: 30,
          type: "activity"
        }
      ];
      
      setItinerary(sampleItinerary);
      setIsGenerating(false);
    }, 2000);
  };

  const resetPlanner = () => {
    setTripData(null);
    setItinerary([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {!tripData ? (
        <Card>
          <CardHeader>
            <CardTitle>Plan Your Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <TripForm onSubmit={generateItinerary} />
          </CardContent>
        </Card>
      ) : (
        <ItineraryDisplay 
          tripData={tripData}
          itinerary={itinerary}
          isGenerating={isGenerating}
          onReset={resetPlanner}
        />
      )}
    </div>
  );
};

export default ItineraryPlanner;
