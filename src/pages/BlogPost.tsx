import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/content';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Post Not Found</h1>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 lg:pt-24">
        <article className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .split('\n')
                  .map((line) => {
                    if (line.startsWith('### ')) return `<h3 class="text-xl font-bold mt-8 mb-3">${line.slice(4)}</h3>`;
                    if (line.startsWith('## ')) return `<h2 class="text-2xl font-bold mt-10 mb-4">${line.slice(3)}</h2>`;
                    if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mt-10 mb-4">${line.slice(2)}</h1>`;
                    if (line.trim() === '') return '';
                    return `<p class="mb-4">${line}</p>`;
                  })
                  .filter(Boolean)
                  .join(''),
              }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
