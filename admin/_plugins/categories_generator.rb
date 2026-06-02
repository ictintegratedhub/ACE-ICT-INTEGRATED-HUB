module Jekyll
  class CategoryPagesGenerator < Generator
    safe true
    
    def generate(site)
      # Get all unique categories from all posts
      categories = site.posts.docs.flat_map { |post| post.data['categories'] || [] }.uniq
      
      categories.each do |category|
        # Skip empty categories
        next if category.nil? || category.empty?
        
        # Create slug for URL (lowercase, replace spaces with hyphens)
        slug = category.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
        
        # Create the category page
        site.pages << CategoryPage.new(site, site.source, "categories/#{slug}", category, slug)
      end
    end
  end

  class CategoryPage < Page
    def initialize(site, base, dir, category, slug)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category.html')
      
      # Set page data
      self.data['title'] = category
      self.data['category'] = category
      self.data['slug'] = slug
      self.data['layout'] = 'category'
    end
  end
end