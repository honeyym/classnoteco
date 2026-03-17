import { useState, useRef } from 'react';
import { useCourseNotes } from '@/hooks/useCourseNotes';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, Download, Trash2, FileText, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CourseNotesProps {
  courseId: string;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CourseNotes({ courseId }: CourseNotesProps) {
  const { user } = useAuth();
  const { notes, isLoading, uploadNote, deleteNote, getDownloadUrl } = useCourseNotes(courseId);
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file || !title.trim()) return;
    setSubmitting(true);
    const { error } = await uploadNote(file, title);
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Notes uploaded!' });
      setTitle('');
      setFile(null);
      setShowUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (note: Parameters<typeof deleteNote>[0]) => {
    await deleteNote(note);
    toast({ title: 'Note deleted' });
  };

  if (isLoading) {
    return (
      <div className="text-center py-14 text-muted-foreground">
        <div className="animate-pulse font-medium">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showUpload ? (
        <Button onClick={() => setShowUpload(true)} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Upload Notes
        </Button>
      ) : (
        <div className="bg-muted/30 rounded-2xl border border-border/50 p-5 space-y-4">
          <h4 className="font-display font-semibold text-foreground">Upload Notes</h4>
          <Input
            placeholder="Note title (e.g. Lecture 5 Summary)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="rounded-xl"
            maxLength={200}
          />
          <div
            className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            {file ? (
              <p className="text-sm font-medium text-foreground">{file.name} ({formatFileSize(file.size)})</p>
            ) : (
              <p className="text-sm text-muted-foreground">Click to select a file (PDF, DOCX, images, etc.)</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.png,.jpg,.jpeg,.webp"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={submitting || !title.trim() || !file} className="rounded-xl">
              {submitting ? 'Uploading...' : 'Upload'}
            </Button>
            <Button variant="ghost" onClick={() => { setShowUpload(false); setFile(null); setTitle(''); }} className="rounded-xl">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
            <FileText className="w-7 h-7 opacity-50" />
          </div>
          <p className="font-semibold text-foreground">No notes yet</p>
          <p className="text-sm mt-1">Upload study notes to share with classmates!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div
              key={note.id}
              className="rounded-2xl border border-border/50 bg-card/60 p-4 flex items-center gap-4 transition-all duration-200 hover:border-primary/30"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-foreground truncate">{note.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {note.author_name} · {formatFileSize(note.file_size)} · {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5"
                  asChild
                >
                  <a href={getDownloadUrl(note.file_path)} target="_blank" rel="noopener noreferrer" download>
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </Button>
                {user?.id === note.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note)}
                    className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
