import { useState } from 'react';
import { Save, Loader2, Globe, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { buildService } from '../services/buildService';

interface SaveBuildDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedComponents: any;
  performance: any;
  totalPrice: number;
  onBuildSaved?: (build: any) => void;
}

export function SaveBuildDialog({ 
  isOpen, 
  onClose, 
  selectedComponents, 
  performance, 
  totalPrice,
  onBuildSaved 
}: SaveBuildDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const getMainComponents = () => {
    const main = [];
    if (selectedComponents.processor) {
      main.push(`${selectedComponents.processor.brand} ${selectedComponents.processor.name}`);
    }
    if (selectedComponents.gpu) {
      main.push(`${selectedComponents.gpu.brand} ${selectedComponents.gpu.name}`);
    }
    return main.join(' + ');
  };

  const getSelectedComponentsCount = () => {
    return Object.values(selectedComponents).filter(Boolean).length;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Please enter a build name');
      return;
    }

    if (getSelectedComponentsCount() < 2) {
      setError('Please select at least 2 components before saving');
      return;
    }

    try {
      setLoading(true);
      
      const buildData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        components: selectedComponents,
        performance,
        total_price: totalPrice,
        is_public: formData.is_public
      };

      const savedBuild = await buildService.saveBuild(buildData);
      
      setSuccess(true);
      onBuildSaved?.(savedBuild);
      
      // Close dialog after short delay to show success
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Save build error:', error);
      setError(error.message || 'Failed to save build');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: '', description: '', is_public: true });
    setError('');
    setSuccess(false);
  };

  const generateSuggestedName = () => {
    const mainComponents = getMainComponents();
    if (mainComponents) {
      const performanceLevel = performance.overall >= 90 ? 'Beast' : 
                             performance.overall >= 80 ? 'Pro' : 
                             performance.overall >= 70 ? 'Solid' : 'Budget';
      return `${performanceLevel} Build - ${mainComponents}`;
    }
    return 'My PC Build';
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Save className="w-5 h-5" />
              Build Saved Successfully!
            </DialogTitle>
            <DialogDescription>
              Your PC build has been saved and {formData.is_public ? 'shared with the community' : 'kept private'}.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-muted-foreground">
              {formData.is_public ? 'Your build is now visible on the community leaderboard!' : 'You can share your build later from your profile.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5 text-primary" />
            Save Your PC Build
          </DialogTitle>
          <DialogDescription>
            Save your configuration to compete on leaderboards and share with the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Build Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Build Summary</span>
              <Badge variant="outline">
                {getSelectedComponentsCount()} components
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{getMainComponents() || 'Custom PC Build'}</p>
              <div className="flex items-center gap-4 mt-2">
                <span>Performance: {Math.round(performance.overall)}/100</span>
                <span>Price: ${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Build Name */}
          <div className="space-y-2">
            <Label htmlFor="build-name">Build Name *</Label>
            <div className="flex gap-2">
              <Input
                id="build-name"
                placeholder="Enter a name for your build"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('name', generateSuggestedName())}
                disabled={loading}
              >
                Suggest
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="build-description">Description (Optional)</Label>
            <Textarea
              id="build-description"
              placeholder="Describe your build, its purpose, or any special features..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {formData.is_public ? (
                <Globe className="w-5 h-5 text-primary" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <div className="font-medium">
                  {formData.is_public ? 'Public Build' : 'Private Build'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formData.is_public 
                    ? 'Visible on leaderboards and community'
                    : 'Only visible to you'
                  }
                </div>
              </div>
            </div>
            <Switch
              checked={formData.is_public}
              onCheckedChange={(checked) => handleInputChange('is_public', checked)}
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Build
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}