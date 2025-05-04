import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Save, 
  Play, 
  Plus, 
  X, 
  MoveDown, 
  FileText, 
  CheckSquare,
  Users,
  Settings,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface DraggingNodeState {
  id: string;
  offsetX: number;
  offsetY: number;
}

const WorkflowBuilder: React.FC = () => {
  const { id } = useParams();
  const { workflows, addWorkflow, updateWorkflow } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [draggingNode, setDraggingNode] = useState<DraggingNodeState | null>(null);
  const [isDrawingConnection, setIsDrawingConnection] = useState<boolean>(false);
  const [connectionStart, setConnectionStart] = useState<{ id: string, port: string } | null>(null);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [showNodePicker, setShowNodePicker] = useState<boolean>(false);
  const [pickerPosition, setPickerPosition] = useState<Position>({ x: 0, y: 0 });
  const [workflow, setWorkflow] = useState({
    id: '',
    name: 'New Workflow',
    description: 'Workflow description',
    status: 'draft' as const,
    steps: [],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  const nodeTypes = [
    { type: 'form', label: 'Form', icon: <FileText className="h-5 w-5" /> },
    { type: 'task', label: 'Task', icon: <CheckSquare className="h-5 w-5" /> },
    { type: 'approval', label: 'Approval', icon: <Users className="h-5 w-5" /> },
    { type: 'condition', label: 'Condition', icon: <Settings className="h-5 w-5" /> }
  ];
  
  // Load workflow if editing
  useEffect(() => {
    if (id) {
      const existingWorkflow = workflows.find(w => w.id === id);
      if (existingWorkflow) {
        setWorkflow(existingWorkflow);
      } else {
        navigate('/workflows');
        addToast('Workflow not found', 'error');
      }
    }
  }, [id, workflows, navigate, addToast]);

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasOffset({ x: rect.left, y: rect.top });
    }
  }, [canvasRef]);

  const saveWorkflow = () => {
    if (id) {
      // Update existing workflow
      updateWorkflow(id, workflow);
      addToast('Workflow updated successfully', 'success');
    } else {
      // Create new workflow
      const newWorkflow = addWorkflow(workflow);
      navigate(`/workflows/${newWorkflow.id}`);
      addToast('Workflow created successfully', 'success');
    }
  };
  
  const addStep = (type: string) => {
    const newStep = {
      id: crypto.randomUUID(),
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      config: {},
      position: { 
        x: (pickerPosition.x - canvasOffset.x) / zoom, 
        y: (pickerPosition.y - canvasOffset.y) / zoom 
      }
    };
    
    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    
    setShowNodePicker(false);
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      setShowNodePicker(true);
      setPickerPosition({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleNodeMouseDown = (e: React.MouseEvent, stepId: string) => {
    e.stopPropagation();
    if (e.button === 0) { // Left mouse button
      // Get the node element
      const node = e.currentTarget as HTMLElement;
      const rect = node.getBoundingClientRect();
      
      setDraggingNode({
        id: stepId,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    if (draggingNode) {
      const newX = (e.clientX - canvasOffset.x - draggingNode.offsetX) / zoom;
      const newY = (e.clientY - canvasOffset.y - draggingNode.offsetY) / zoom;
      
      setWorkflow(prev => ({
        ...prev,
        steps: prev.steps.map(step => 
          step.id === draggingNode.id
            ? { ...step, position: { x: newX, y: newY } }
            : step
        )
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    if (isDrawingConnection) {
      setIsDrawingConnection(false);
      setConnectionStart(null);
    }
  };
  
  const handleActivateWorkflow = () => {
    setWorkflow(prev => ({
      ...prev,
      status: 'active'
    }));
    
    if (id) {
      updateWorkflow(id, { status: 'active' });
      addToast('Workflow activated successfully', 'success');
    }
  };
  
  const deleteStep = (stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header with controls */}
      <header className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="mr-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/workflows')}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workflow.name}</h1>
            <p className="text-gray-500">{workflow.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline" onClick={saveWorkflow}>
            <Save className="h-5 w-5" />
            Save
          </button>
          {workflow.status !== 'active' && (
            <button className="btn btn-success" onClick={handleActivateWorkflow}>
              <Play className="h-5 w-5" />
              Activate
            </button>
          )}
        </div>
      </header>
      
      {/* Main canvas */}
      <div className="flex-1 bg-gray-50 border rounded-lg overflow-auto">
        <div 
          ref={canvasRef}
          className="relative w-full h-full min-h-[500px]"
          style={{ 
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
            backgroundSize: `${20 * zoom}px ${20 * zoom}px` 
          }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Steps/Nodes */}
          {workflow.steps.map(step => (
            <div 
              key={step.id}
              className="absolute bg-white rounded-lg shadow-md p-4 min-w-[200px] cursor-move border-2 border-transparent hover:border-primary-300"
              style={{ 
                left: `${step.position.x * zoom}px`, 
                top: `${step.position.y * zoom}px`,
                zIndex: draggingNode?.id === step.id ? 10 : 1,
                transform: `scale(${zoom})`
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, step.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`px-2 py-1 text-xs rounded-full
                  ${step.type === 'form' ? 'bg-primary-100 text-primary-800' : ''}
                  ${step.type === 'task' ? 'bg-secondary-100 text-secondary-800' : ''}
                  ${step.type === 'approval' ? 'bg-warning-100 text-warning-800' : ''}
                  ${step.type === 'condition' ? 'bg-accent-100 text-accent-800' : ''}
                `}>
                  {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                </span>
                <button
                  className="text-gray-400 hover:text-error-500"
                  onClick={() => deleteStep(step.id)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="font-medium text-gray-900">{step.name}</div>
              
              {/* Connection ports */}
              <div className="mt-2 flex justify-between">
                <div className="flex">
                  <div className="w-4 h-4 rounded-full bg-gray-300 hover:bg-primary-500 cursor-pointer" />
                </div>
                <div className="flex">
                  <div className="w-4 h-4 rounded-full bg-gray-300 hover:bg-primary-500 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
          
          {/* Node picker popup */}
          {showNodePicker && (
            <div 
              className="absolute bg-white rounded-lg shadow-lg p-3 z-20"
              style={{ left: pickerPosition.x - canvasOffset.x, top: pickerPosition.y - canvasOffset.y }}
            >
              <div className="flex flex-col space-y-2">
                <div className="text-sm font-medium pb-2 border-b">Add Node</div>
                {nodeTypes.map(nodeType => (
                  <button
                    key={nodeType.type}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 rounded text-sm text-left"
                    onClick={() => addStep(nodeType.type)}
                  >
                    {nodeType.icon}
                    <span className="ml-2">{nodeType.label}</span>
                  </button>
                ))}
                <button
                  className="text-gray-500 hover:text-gray-700 self-end text-sm"
                  onClick={() => setShowNodePicker(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Properties panel */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Workflow Properties</h2>
        <div className="space-y-4">
          <div className="form-control">
            <label className="form-label" htmlFor="workflow-name">
              Workflow Name
            </label>
            <input
              id="workflow-name"
              type="text"
              className="form-input"
              value={workflow.name}
              onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-control">
            <label className="form-label" htmlFor="workflow-description">
              Description
            </label>
            <textarea
              id="workflow-description"
              className="form-textarea"
              value={workflow.description}
              onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="form-control">
            <label className="form-label" htmlFor="workflow-status">
              Status
            </label>
            <select
              id="workflow-status"
              className="form-select"
              value={workflow.status}
              onChange={(e) => setWorkflow(prev => ({ 
                ...prev, 
                status: e.target.value as 'active' | 'draft' | 'archived' 
              }))}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;