import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Check } from 'lucide-react';

interface ComponentOption {
  id: string;
  name: string;
  brand: string;
  price: number;
  specifications: Record<string, string>;
  performance?: string;
  image?: string;
}

interface ComponentSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  componentType: string;
  componentName: string;
  options: ComponentOption[];
  selectedComponent: ComponentOption | null;
  onSelectComponent: (component: ComponentOption) => void;
}

export function ComponentSelectionDialog({
  isOpen,
  onClose,
  componentType,
  componentName,
  options,
  selectedComponent,
  onSelectComponent
}: ComponentSelectionDialogProps) {
  const [selectedOption, setSelectedOption] = useState<ComponentOption | null>(selectedComponent);

  const handleSelect = () => {
    if (selectedOption) {
      onSelectComponent(selectedOption);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select {componentName}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {options.map((option) => (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all ${
                  selectedOption?.id === option.id 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{option.brand} {option.name}</h4>
                        {selectedOption?.id === option.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        {Object.entries(option.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                      
                      {option.performance && (
                        <Badge variant="secondary" className="mb-2">
                          {option.performance}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="text-2xl font-semibold">${option.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">USD</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <div>
            {selectedOption && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedOption.brand} {selectedOption.name} - ${selectedOption.price.toLocaleString()}
              </p>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSelect} disabled={!selectedOption}>
              {selectedComponent ? 'Update Selection' : 'Select Component'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}