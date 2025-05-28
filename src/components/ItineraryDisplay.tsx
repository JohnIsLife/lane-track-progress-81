
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, DollarSign, Plane, Bed, Utensils, Car } from "lucide-react";
import { TripData, ItineraryItem } from "./ItineraryPlanner";

interface ItineraryDisplayProps {
  tripData: TripData;
  itinerary: ItineraryItem[];
  isGenerating: boolean;
  onReset: () => void;
}

const ItineraryDisplay = ({ tripData, itinerary, isGenerating, onReset }: ItineraryDisplayProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-4 w-4" />;
      case "accommodation":
        return <Bed className="h-4 w-4" />;
      case "meal":
        return <Utensils className="h-4 w-4" />;
      case "transport":
        return <Car className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "accommodation":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "meal":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "transport":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalCost = itinerary.reduce((sum, item) => sum + item.estimatedCost, 0);
  const remainingBudget = tripData.budget - totalCost;

  const groupedByDay = itinerary.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Generating Your Itinerary</h3>
          <p className="text-gray-600">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Plan New Trip
        </Button>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {tripData.destinations.join(" → ")} • {tripData.days} days
          </p>
          <p className="text-sm text-gray-600">
            {format(tripData.startDate, "MMM dd")} - {format(tripData.endDate, "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-lg font-semibold">{tripData.currency} {totalCost}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-lg font-semibold">{tripData.currency} {tripData.budget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className={`h-5 w-5 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className={`text-lg font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tripData.currency} {remainingBudget}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByDay).map(([day, dayItems]) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Day {day}</span>
                <Badge variant="outline">{dayItems.length} activities</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dayItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 min-w-20">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{item.time}</span>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getTypeColor(item.type)}>
                          {getTypeIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </Badge>
                      </div>
                      
                      <h4 className="font-medium">{item.activity}</h4>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {item.estimatedCost > 0 ? `${tripData.currency} ${item.estimatedCost}` : 'Free'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
