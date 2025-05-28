
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TripData, ItineraryItem } from '@/components/ItineraryPlanner';

export const generateItineraryPDF = async (tripData: TripData, itinerary: ItineraryItem[]) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Title
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text('Travel Itinerary', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Trip details
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Destinations: ${tripData.destinations.join(' → ')}`, margin, yPosition);
  yPosition += 10;
  pdf.text(`Duration: ${tripData.days} days`, margin, yPosition);
  yPosition += 10;
  pdf.text(`Budget: ${tripData.currency} ${tripData.budget}`, margin, yPosition);
  yPosition += 20;

  // Group activities by day
  const groupedByDay = itinerary.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  // Add each day's activities
  for (let day = 1; day <= tripData.days; day++) {
    const dayItems = groupedByDay[day] || [];
    
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    // Day header
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Day ${day}`, margin, yPosition);
    yPosition += 15;

    // Day activities
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    if (dayItems.length === 0) {
      pdf.text('No activities planned', margin + 10, yPosition);
      yPosition += 10;
    } else {
      dayItems
        .sort((a, b) => a.time.localeCompare(b.time))
        .forEach(item => {
          const text = `${item.time} - ${item.activity} (${item.location})`;
          const cost = item.estimatedCost > 0 ? ` - ${tripData.currency} ${item.estimatedCost}` : ' - Free';
          
          pdf.text(text, margin + 10, yPosition);
          yPosition += 8;
          pdf.text(cost, margin + 20, yPosition);
          yPosition += 12;
        });
    }
    
    yPosition += 10;
  }

  // Total cost
  const totalCost = itinerary.reduce((sum, item) => sum + item.estimatedCost, 0);
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text(`Total Estimated Cost: ${tripData.currency} ${totalCost}`, margin, yPosition);

  // Save the PDF
  const fileName = `itinerary-${tripData.destinations.join('-').replace(/\s+/g, '-').toLowerCase()}.pdf`;
  pdf.save(fileName);
};
