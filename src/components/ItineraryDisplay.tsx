import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, DollarSign } from "lucide-react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { TripData, ItineraryItem } from "./ItineraryPlanner";
import ItineraryItemCard from "./ItineraryItemCard";
import AddEditActivityDialog from "./AddEditActivityDialog";
import { useToast } from "@/hooks/use-toast";

interface ItineraryDisplayProps {
  tripData: TripData;
  itinerary: ItineraryItem[];
  isGenerating: boolean;
  onReset: () => void;
  onUpdateItinerary: (newItinerary: ItineraryItem[]) => void;
}

const ItineraryDisplay = ({ 
  tripData, 
  itinerary, 
  isGenerating, 
  onReset,
  onUpdateItinerary 
}: ItineraryDisplayProps) => {
  const { toast } = useToast();

  const addOrUpdateActivity = (item: ItineraryItem) => {
    const existingIndex = itinerary.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Update existing item
      const newItinerary = [...itinerary];
      newItinerary[existingIndex] = item;
      onUpdateItinerary(newItinerary);
      toast({
        title: "Activity updated",
        description: `"${item.activity}" has been updated`,
      });
    } else {
      // Add new item
      const newItinerary = [...itinerary, item];
      onUpdateItinerary(newItinerary);
      toast({
        title: "Activity added",
        description: `"${item.activity}" has been added to Day ${item.day}`,
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceDay = parseInt(source.droppableId);
    const destinationDay = parseInt(destination.droppableId);
    
    const item = itinerary.find(item => item.id === draggableId);
    if (!item) {
      return;
    }

    // Update the item's day
    const updatedItem = { ...item, day: destinationDay };
    
    // Create new itinerary with updated item
    const newItinerary = itinerary.map(i => 
      i.id === draggableId ? updatedItem : i
    );

    onUpdateItinerary(newItinerary);
    toast({
      title: "Activity moved",
      description: `"${item.activity}" moved to Day ${destinationDay}`,
    });
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

  // Create columns for all days in the trip
  const dayColumns = Array.from({ length: tripData.days }, (_, index) => {
    const dayNumber = index + 1;
    return {
      day: dayNumber,
      items: groupedByDay[dayNumber] || []
    };
  });

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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dayColumns.map((column) => (
            <div key={column.day} className="bg-white rounded-lg shadow-md border-t-4 border-t-blue-400 bg-blue-50 min-h-[400px] flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">Day {column.day}</h3>
                  <Badge variant="outline" className="bg-gray-200 text-gray-700">
                    {column.items.length}
                  </Badge>
                </div>
              </div>

              <Droppable droppableId={column.day.toString()}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 space-y-3 transition-colors ${
                      snapshot.isDraggingOver ? "bg-gray-50" : ""
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <ItineraryItemCard
                        key={item.id}
                        item={item}
                        index={index}
                        currency={tripData.currency}
                        onUpdateItem={addOrUpdateActivity}
                      />
                    ))}
                    {provided.placeholder}
                    
                    <AddEditActivityDialog
                      day={column.day}
                      currency={tripData.currency}
                      onSave={addOrUpdateActivity}
                    />
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ItineraryDisplay;
