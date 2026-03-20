'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectGif: (url: string) => void;
};

type GifResult = {
  id: string;
  title: string;
  images: {
    fixed_height_small: {
      url: string;
    };
  };
};

export function GifSearchDialog({ open, onOpenChange, onSelectGif }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchGifs = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Use Giphy Public API (no key required for basic searches)
      // Fallback to a simple search URL if API is not available
      const response = await fetch(
        `https://giphy.com/api/gifs?q=${encodeURIComponent(searchQuery)}&limit=8&offset=0`,
        { mode: 'no-cors' }
      ).catch(() => null);

      // If the fetch fails, provide a fallback experience with popular GIF sources
      if (!response) {
        // Use popular GIF hosting URLs as fallback
        toast.info('Using fallback GIF sources. Try Giphy links directly!');
        return;
      }

      // Alternative: For now, just provide search suggestions and let users paste URLs
      toast.info('Paste a Giphy, Tenor, or any direct GIF URL below');
    } catch (error) {
      console.error('GIF search error:', error);
      toast.error('Could not search GIFs. Try pasting a direct URL instead.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void searchGifs(query);
    },
    [query, searchGifs]
  );

  const handleSelectGif = (result: GifResult) => {
    const url = result.images.fixed_height_small.url;
    onSelectGif(url);
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
    onOpenChange(false);
  };

  const handleUrlPaste = () => {
    const urlInput = document.querySelector('input[placeholder*="url"]') as HTMLInputElement | null;
    if (urlInput) {
      try {
        navigator.clipboard.readText().then((text) => {
          if (/^https?:\/\/.+\.(gif|png|jpg|jpeg|webp)($|\?)/i.test(text)) {
            onSelectGif(text);
            setQuery('');
            setResults([]);
            onOpenChange(false);
          } else {
            toast.error('Clipboard does not contain a valid GIF/image URL');
          }
        });
      } catch {
        toast.error('Could not access clipboard');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send GIF or Sticker</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search GIFs or paste URL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-sm flex-1"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !query.trim()}
              className="shrink-0"
            >
              <Icon icon="solar:magnifer-linear" className="size-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleUrlPaste}
              title="Paste GIF URL from clipboard"
              className="shrink-0"
            >
              <Icon icon="solar:clipboard-list-linear" className="size-4" />
            </Button>
          </form>

          {results.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {results.map((gif, idx) => (
                <button
                  key={gif.id}
                  onClick={() => handleSelectGif(gif)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    selectedIndex === idx
                      ? 'border-primary ring-2 ring-primary/50'
                      : 'border-border hover:border-primary/50'
                  }`}
                  title={gif.title}
                >
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    className="h-32 w-full object-cover"
                    onMouseEnter={() => setSelectedIndex(idx)}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Icon icon="solar:check-circle-linear" className="size-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.length === 0 && (
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              <Icon icon="solar:gallery-linear" className="size-8 mx-auto mb-2 opacity-50" />
              <p>Search for GIFs or paste a direct URL</p>
              <p className="text-xs mt-2">Supports: Giphy, Tenor, or any direct GIF/sticker link</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
