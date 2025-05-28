
import KanbanBoard from "@/components/KanbanBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Project Board</h1>
          <p className="text-gray-600">Organize your tasks and track progress</p>
        </header>
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Index;
