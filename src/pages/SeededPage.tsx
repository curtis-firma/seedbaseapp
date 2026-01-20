import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Plus, Minus, X, Check, Wallet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MovementSection } from '@/components/shop/MovementSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Product images
import cikHoodieGreyImg from "@/assets/products/cik-hoodie-grey.jpg";
import christIsKingTeeImg from "@/assets/products/christ-is-king-tee-model.jpg";
import gnrusHatImg from "@/assets/products/gnrus-hat-model.jpg";
import seededSweatsGreyImg from "@/assets/products/seeded-sweats-grey.jpg";
import cikBeanieGreyImg from "@/assets/products/cik-beanie-grey.jpg";
import christIsKingCrewneckGreyImg from "@/assets/products/christ-is-king-crewneck-grey.jpg";
import kingdomHoodieImg from "@/assets/products/kingdom-hoodie.jpg";
import seededHoodieModelImg from "@/assets/products/seeded-hoodie-model.jpg";
import gnrusHoodieImg from "@/assets/products/gnrus-hoodie.jpg";
import ogCikMemeHoodieImg from "@/assets/products/og-cik-meme-hoodie-back.jpg";

// Featured product
const featuredProduct = {
  id: 0,
  name: "SEEDED Hoodie",
  price: 99,
  category: "SEEDED",
  image: seededHoodieModelImg,
  description: "Premium heavyweight cotton hoodie. The signature piece of the movement.",
  sizes: ["S", "M", "L", "XL", "XXL"],
};

const storeProducts = [
  { id: 1, name: "Kingdom Hoodie", price: 89, category: "SEEDED", image: kingdomHoodieImg, description: "Premium heavyweight cotton hoodie", sizes: ["S", "M", "L", "XL"] },
  { id: 2, name: "SEEDED Sweats", price: 75, category: "SEEDED", image: seededSweatsGreyImg, description: "Comfortable everyday sweats", sizes: ["S", "M", "L", "XL"] },
  { id: 3, name: "CIK Hoodie", price: 89, category: "CIK", image: cikHoodieGreyImg, description: "Classic Christ is King hoodie", sizes: ["S", "M", "L", "XL"] },
  { id: 4, name: "CIK Beanie", price: 32, category: "CIK", image: cikBeanieGreyImg, description: "Warm knit beanie", sizes: ["One Size"] },
  { id: 5, name: "Christ is King Tee", price: 45, category: "Christ is King", image: christIsKingTeeImg, description: "Premium cotton tee", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 6, name: "Christ is King Crewneck", price: 95, category: "Christ is King", image: christIsKingCrewneckGreyImg, description: "Heavyweight crewneck", sizes: ["S", "M", "L", "XL"] },
  { id: 7, name: "GNRUS Hat", price: 35, category: "GNRUS", image: gnrusHatImg, description: "Adjustable snapback", sizes: ["One Size"] },
  { id: 8, name: "GNRUS Hoodie", price: 95, category: "GNRUS", image: gnrusHoodieImg, description: "God's Not Real Until Seen - Premium heavyweight hoodie", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 9, name: "OG CIK Meme Hoodie", price: 110, category: "CIK", image: ogCikMemeHoodieImg, description: "The iconic meme on the back. Model shown from behind.", sizes: ["S", "M", "L", "XL", "XXL"] },
];

const categories = ["All", "SEEDED", "CIK", "Christ is King", "GNRUS"];

interface CartItem {
  product: typeof storeProducts[0];
  quantity: number;
  size: string;
}

type CheckoutStep = "cart" | "connecting" | "connected" | "processing" | "complete";

export default function SeededPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof storeProducts[0] | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");

  const filteredProducts = selectedCategory === "All"
    ? storeProducts
    : storeProducts.filter(p => p.category === selectedCategory);

  const addToCart = (product: typeof storeProducts[0], size: string) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, size }];
    });
    toast.success(`Added ${product.name} (${size}) to cart`);
    setSelectedSize("");
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId && item.size === size);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => !(item.product.id === productId && item.size === size));
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleBasePay = () => {
    setCheckoutStep("connecting");
    setTimeout(() => {
      setCheckoutStep("connected");
      setTimeout(() => {
        setCheckoutStep("processing");
        setTimeout(() => {
          setCheckoutStep("complete");
          setCart([]);
        }, 1500);
      }, 1000);
    }, 2000);
  };

  const resetCheckout = () => {
    setShowCheckout(false);
    setCheckoutStep("cart");
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass-strong border-b border-border/50">
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Seeded Store</h1>
                <p className="text-sm text-muted-foreground">Merch & Movement</p>
              </div>
            </div>

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCheckout(true)}
              className="relative px-4 py-2 rounded-xl bg-foreground text-background font-medium flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 py-6 space-y-8 max-w-7xl mx-auto">
        {/* Movement Section - AT TOP */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">The Movement</h2>
          <MovementSection />
        </div>

        {/* Mission Badge */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
          <Heart className="w-5 h-5 text-rose-500" />
          <span className="text-sm text-foreground">100% of proceeds go to missions worldwide</span>
        </div>

        {/* Featured Product */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden bg-card border border-border shadow-lg"
        >
          <div className="grid md:grid-cols-2">
            <div className="aspect-square md:aspect-auto relative overflow-hidden">
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-bold">
                  FEATURED
                </span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground mb-2">{featuredProduct.category}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{featuredProduct.name}</h3>
              <p className="text-muted-foreground mb-4">{featuredProduct.description}</p>
              <p className="text-3xl font-bold text-foreground mb-6">${featuredProduct.price}</p>
              
              {/* Size Selector */}
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {featuredProduct.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(featuredProduct as any, selectedSize)}
                className="w-full py-4 rounded-xl bg-foreground text-background font-semibold text-lg"
              >
                Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground border border-border hover:bg-muted"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => {
                setSelectedProduct(product);
                setSelectedSize("");
              }}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                <h4 className="font-semibold text-foreground mb-1">{product.name}</h4>
                <span className="font-bold text-lg text-foreground">${product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Quick View Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg">
          {selectedProduct && (
            <>
              <div className="aspect-square rounded-xl overflow-hidden mb-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader>
                <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground">{selectedProduct.description}</p>
              <p className="text-2xl font-bold mt-2">${selectedProduct.price}</p>
              
              {/* Size Selector */}
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-3">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  addToCart(selectedProduct, selectedSize);
                  if (selectedSize) setSelectedProduct(null);
                }}
                className="w-full py-4 rounded-xl bg-foreground text-background font-semibold mt-4"
              >
                Add to Cart
              </motion.button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl w-full max-w-md overflow-hidden border border-border shadow-lg"
            >
              {/* Connecting */}
              {checkoutStep === "connecting" && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-[#0052FF] animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Connecting Wallet</h3>
                  <p className="text-muted-foreground text-sm">Please confirm the connection...</p>
                </div>
              )}

              {/* Connected */}
              {checkoutStep === "connected" && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-8 h-8 text-[#0052FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Wallet Connected</h3>
                  <p className="text-muted-foreground text-sm mb-4">0x1234...5678</p>
                  <p className="text-sm text-muted-foreground">Processing payment...</p>
                </div>
              )}

              {/* Processing */}
              {checkoutStep === "processing" && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-[#0052FF] animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Processing Payment</h3>
                  <p className="text-muted-foreground text-sm">Confirming transaction on Base...</p>
                </div>
              )}

              {/* Complete */}
              {checkoutStep === "complete" && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Order Complete!</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Thank you for supporting the mission. Your order will ship within 3-5 days.
                  </p>
                  <button
                    onClick={resetCheckout}
                    className="w-full py-3 bg-foreground text-background font-semibold rounded-xl"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Cart View */}
              {checkoutStep === "cart" && (
                <>
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-lg text-foreground">Checkout</h3>
                    <button
                      onClick={resetCheckout}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  </div>

                  <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="py-8 text-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {cart.map((item) => (
                            <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">${item.product.price} • {item.size}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => removeFromCart(item.product.id, item.size)}
                                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-6 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => addToCart(item.product, item.size)}
                                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-border">
                          <div className="flex justify-between mb-4">
                            <span className="font-medium">Total</span>
                            <span className="font-bold text-xl">${cartTotal}</span>
                          </div>
                          <button
                            onClick={handleBasePay}
                            className="w-full py-4 rounded-xl bg-foreground text-background font-semibold flex items-center justify-center gap-2"
                          >
                            <div className="w-5 h-5 rounded-sm bg-primary" />
                            Pay with Base
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
