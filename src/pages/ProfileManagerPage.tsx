import React, { useRef } from 'react';
import { useProfileStore, Profile } from '@/store/profileStore';
import { useConfigStore } from '@/store/configStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Trash2, Edit, Copy, Github, Calendar, Gamepad2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DEFAULT_MAPPING } from '@/lib/schema';
export function ProfileManagerPage() {
  const profiles = useProfileStore(s => s.profiles);
  const addProfile = useProfileStore(s => s.addProfile);
  const deleteProfile = useProfileStore(s => s.deleteProfile);
  const importProfile = useProfileStore(s => s.importProfile);
  const loadConfig = useConfigStore(s => s.loadConfig);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleCreateNew = () => {
    const newProfile = addProfile(DEFAULT_MAPPING);
    toast.success("Profile Created", { description: "New profile added to your library." });
    handleEdit(newProfile);
  };
  const handleEdit = (profile: Profile) => {
    loadConfig(JSON.stringify(profile), profile.id);
    navigate('/visualizer');
  };
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProfile(id);
    toast.success("Profile Deleted");
  };
  const handleDuplicate = (profile: Profile, e: React.MouseEvent) => {
    e.stopPropagation();
    const { id, createdAt, updatedAt, ...rest } = profile;
    addProfile({ ...rest, title: `${profile.title} (Copy)` });
    toast.success("Profile Duplicated");
  };
  const handleExportGithub = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Export to GitHub", { description: "This feature is coming soon!" });
  };
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importProfile(content);
        if (result) {
          toast.success("Profile Imported", { description: `Imported ${file.name} successfully.` });
        } else {
          toast.error("Import Failed", { description: "Invalid JSON file." });
        }
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profiles</h1>
            <p className="text-muted-foreground">Manage your controller configurations.</p>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleFileChange}
            />
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
            <Button onClick={handleCreateNew} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Profile
            </Button>
          </div>
        </div>
        {profiles.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
            <Gamepad2 className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No profiles yet</h3>
            <p className="text-muted-foreground mb-6">Create a new profile or import an existing one to get started.</p>
            <Button onClick={handleCreateNew}>Create First Profile</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card 
                key={profile.id} 
                className="group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer bg-card/50 backdrop-blur"
                onClick={() => handleEdit(profile)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="truncate pr-4">{profile.title || "Untitled"}</CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleDuplicate(profile, e)} title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => handleDelete(profile.id, e)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    Updated {formatDistanceToNow(new Date(profile.updatedAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Gamepad2 className="w-4 h-4" />
                      <span>{profile.controllerType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{profile.modes.length} Modes</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t bg-muted/20">
                  <div className="w-full flex justify-between items-center">
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={(e) => handleExportGithub(e)}>
                      <Github className="w-3 h-3 mr-1.5" />
                      Export
                    </Button>
                    <Button size="sm" className="h-7 bg-secondary hover:bg-secondary/80 text-secondary-foreground" onClick={(e) => { e.stopPropagation(); handleEdit(profile); }}>
                      <Edit className="w-3 h-3 mr-1.5" />
                      Edit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}