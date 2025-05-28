import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Plane, Bed, Utensils, Car } from "lucide-react";
import { ItineraryItem } from "./ItineraryPlanner";
import AddEditActivityDialog from "./AddEditActivityDialog";

interface ItineraryItemCardProps {
  item: ItineraryItem;
  index: number;
  currency: string;
  onUpdateItem: (item: ItineraryItem) => void;
}

const ItineraryItemCard = ({ item, index, currency, onUpdateItem }: ItineraryItemCardProps) => {
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

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ? "shadow-lg rotate-2 scale-105" : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getTypeColor(item.type)}>
                  {getTypeIcon(item.type)}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-gray-600 ml-auto">
                  <Clock className="h-3 w-3" />
                  <span>{item.time}</span>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-900 text-sm leading-tight">
                {item.activity}
              </h4>
              
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{item.location}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {item.estimatedCost > 0 ? `${currency} ${item.estimatedCost}` : 'Free'}
                </span>
                
                <AddEditActivityDialog
                  day={item.day}
                  item={item}
                  currency={currency}
                  onSave={onUpdateItem}
                  isEdit={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default ItineraryItemCard;
