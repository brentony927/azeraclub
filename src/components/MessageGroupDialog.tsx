import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onGroupCreated: () => void;
  connections: { userId: string; name: string }[];
}

export default function MessageGroupDialog({ onGroupCreated, connections }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);

    let photo_url: string | null = null;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `${user.id}/group_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, photoFile);
      if (!error) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        photo_url = data.publicUrl;
      }
    }

    const { data: group, error } = await supabase.from("message_groups" as any).insert({
      name: name.trim(),
      description: description.trim() || null,
      photo_url,
      created_by: user.id,
    }).select().single();

    if (error || !group) {
      toast({ title: "Erro ao criar grupo", variant: "destructive" });
      setSaving(false);
      return;
    }

    // Add creator as admin
    const members = [
      { group_id: (group as any).id, user_id: user.id, role: "admin" },
      ...selectedMembers.map(uid => ({ group_id: (group as any).id, user_id: uid, role: "member" })),
    ];
    await supabase.from("message_group_members" as any).insert(members);

    setSaving(false);
    setOpen(false);
    setName("");
    setDescription("");
    setSelectedMembers([]);
    setPhotoFile(null);
    setPhotoPreview(null);
    onGroupCreated();
    toast({ title: "Grupo criado!" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Novo Grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Grupo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Photo */}
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-16 h-16 rounded-full border-2 border-dashed border-border hover:border-primary flex items-center justify-center overflow-hidden transition-colors"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <ImagePlus className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1">
              <Label>Nome do Grupo</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Startup Squad" maxLength={50} />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Descrição (opcional)</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Sobre o que é este grupo?" rows={2} maxLength={200} />
          </div>

          {/* Members */}
          <div className="space-y-1">
            <Label>Adicionar Membros</Label>
            {connections.length === 0 ? (
              <p className="text-xs text-muted-foreground">Conecte-se com outros founders primeiro.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1">
                {connections.map(c => (
                  <button
                    key={c.userId}
                    onClick={() => toggleMember(c.userId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedMembers.includes(c.userId) ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleCreate} disabled={saving || !name.trim()} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Criar Grupo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
