import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Trash2, Send, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendNotification } from "@/lib/sendNotification";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

interface Props {
  post: {
    id: string;
    user_id: string;
    content: string;
    media_urls: string[];
    created_at: string;
  };
  authorName: string;
  authorAvatar: string | null;
  authorUsername: string | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  comments: Comment[];
  onRefresh: () => void;
  myName?: string;
}

export default function FounderPostCard({
  post, authorName, authorAvatar, authorUsername, likesCount, commentsCount, isLiked, comments, onRefresh, myName,
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likesCount);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(commentsCount);

  useEffect(() => { setLiked(isLiked); }, [isLiked]);
  useEffect(() => { setLikes(likesCount); }, [likesCount]);
  useEffect(() => { setLocalCommentsCount(commentsCount); }, [commentsCount]);

  const isOwn = user?.id === post.user_id;
  const initials = authorName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const timeAgo = getTimeAgo(post.created_at);

  const toggleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from("founder_post_likes" as any).delete().eq("post_id", post.id).eq("user_id", user.id);
      setLiked(false);
      setLikes(prev => Math.max(0, prev - 1));
    } else {
      await supabase.from("founder_post_likes" as any).insert({ post_id: post.id, user_id: user.id });
      setLiked(true);
      setLikes(prev => prev + 1);
      // Notify post author
      if (post.user_id !== user.id) {
        sendNotification({
          user_id: post.user_id,
          type: "post_like",
          title: `${myName || "Alguém"} curtiu sua publicação ❤️`,
          action_url: "/founder-feed",
        });
      }
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;
    setSendingComment(true);
    const { error } = await supabase.from("founder_post_comments" as any).insert({
      post_id: post.id,
      user_id: user.id,
      content: commentText.trim(),
    });
    setSendingComment(false);
    if (!error) {
      setCommentText("");
      setLocalCommentsCount(prev => prev + 1);
      onRefresh();
      // Notify post author
      if (post.user_id !== user.id) {
        sendNotification({
          user_id: post.user_id,
          type: "post_comment",
          title: `${myName || "Alguém"} comentou na sua publicação 💬`,
          action_url: "/founder-feed",
        });
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("founder_posts" as any).delete().eq("id", post.id);
    setDeleting(false);
    onRefresh();
    toast({ title: "Post excluído ✓" });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/founder-feed`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado! 📋" });
  };

  return (
    <div className="bg-card/80 border border-border/50 rounded-xl p-4 backdrop-blur-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/founder-profile/${authorUsername || post.user_id}`)}
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-foreground">{initials}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{authorName}</p>
            <p className="text-[10px] text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        {isOwn && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir publicação?</AlertDialogTitle>
                <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className={`grid gap-2 ${post.media_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {post.media_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="w-full rounded-lg object-cover max-h-64 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(url, "_blank")}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-border/30">
        <button onClick={toggleLike} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          {likes > 0 && <span>{likes}</span>}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="h-4 w-4" />
          {localCommentsCount > 0 && <span>{localCommentsCount}</span>}
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="space-y-2 pt-2">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                {c.author_avatar ? (
                  <img src={c.author_avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <span className="text-[8px] font-bold text-foreground">{(c.author_name || "?")[0]}</span>
                )}
              </div>
              <div className="bg-secondary/50 rounded-lg px-3 py-1.5 flex-1">
                <p className="text-[11px] font-medium text-foreground">{c.author_name || "Founder"}</p>
                <p className="text-xs text-foreground/80">{c.content}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Escrever comentário..."
              className="min-h-[36px] h-9 text-xs resize-none"
              maxLength={500}
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleComment} disabled={sendingComment || !commentText.trim()}>
              {sendingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString("pt-BR");
}
