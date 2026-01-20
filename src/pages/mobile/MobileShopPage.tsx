import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Heart, 
  X, 
  Check, 
  Wallet, 
  Loader2,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { MobileMenuPageLayout } from "./MobileMenuPageLayout";
import { BasePayButton } from "@/components/BasePayButton";
import { toast } from "sonner";

// Product images
import cikHoodieGreyImg from "@/assets/products/cik-hoodie-grey.jpg";
import christIsKingTeeImg from "@/assets/products/christ-is-king-tee-model.jpg";
import gnrusHatImg from "@/assets/products/gnrus-hat-model.jpg";
import seededSweatsGreyImg from "@/assets/products/seeded-sweats-grey.jpg";
import cikBeanieGreyImg from "@/assets/products/cik-beanie-grey.jpg";
import christIsKingCrewneckGreyImg from "@/assets/products/christ-is-king-crewneck-grey.jpg";
import kingdomHoodieImg from "@/assets/products/kingdom-hoodie.jpg";
import { MovementSection } from "@/components/shop/MovementSection";

interface MobileShopPageProps {
  onBack?: () => void;
  onOpenChat?: () => void;
}

const storeProducts = [
  { id: 1, name: "SEEDED Hoodie", price: 89, category: "SEEDED", image: kingdomHoodieImg },
  { id: 2, name: "SEEDED Sweats", price: 75, category: "SEEDED", image: seededSweatsGreyImg },
  { id: 3, name: "CIK Hoodie", price: 89, category: "CIK", image: cikHoodieGreyImg },
  { id: 4, name: "CIK Beanie", price: 32, category: "CIK", image: cikBeanieGreyImg },
  { id: 5, name: "Christ is King Tee", price: 45, category: "Christ is King", image: christIsKingTeeImg },
  { id: 6, name: "Christ is King Crewneck", price: 95, category: "Christ is King", image: christIsKingCrewneckGreyImg },
  { id: 7, name: "GNRUS Hat", price: 35, category: "GNRUS", image: gnrusHatImg },
];

const categories = ["All", "SEEDED", "CIK", "Christ is King", "GNRUS"];

interface CartItem {
  product: typeof storeProducts[0];
  quantity: number;
}

type CheckoutStep = "cart" | "connecting" | "connected" | "processing" | "complete";

const tabs = [
  { id: "shop", label: "Shop" },
  { id: "cart", label: "Cart" },
];

export function MobileShopPage({ onBack, onOpenChat }: MobileShopPageProps) {
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");

  const filteredProducts = selectedCategory === "All" 
    ? storeProducts 
    : storeProducts.filter(p => p.category === selectedCategory);

  const addToCart = (product: typeof storeProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
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

  // Update tabs to show cart count
  const dynamicTabs = [
    { id: "shop", label: "Shop" },
    { id: "cart", label: `Cart${cartCount > 0 ? ` (${cartCount})` : ""}` },
  ];

  return (
    <MobileMenuPageLayout 
      title="Seeded Store" 
      onBack={onBack}
      tabs={dynamicTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onChatClick={onOpenChat}
    >
      <AnimatePresence mode="wait">
        {activeTab === "shop" && (
          <motion.div
            key="shop"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-5 pt-5 space-y-4"
          >
            {/* Mission Badge */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="text-sm text-foreground">100% of proceeds go to missions</span>
            </div>

            {/* Featured Product */}
            <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
              <div className="flex items-stretch">
                <div className="w-1/2 aspect-square">
                  <img 
                    src={kingdomHoodieImg} 
                    alt="Seeded Hoodie" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-1/2 p-4 flex flex-col justify-center">
                  <span className="px-2 py-1 rounded-md bg-foreground text-background text-[10px] font-medium mb-2 inline-block w-fit">FEATURED</span>
                  <h3 className="font-bold text-foreground mb-1">Seeded Baggy Hoodie</h3>
                  <p className="text-xs text-muted-foreground mb-3">Premium heavyweight cotton</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-foreground">$89</span>
                    <button 
                      onClick={() => addToCart({ id: 1, name: "Seeded Baggy Hoodie", price: 89, category: "SEEDED", image: kingdomHoodieImg })}
                      className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium active:scale-[0.98] transition-transform"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-foreground text-background"
                      : "bg-card text-muted-foreground border border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-3 pb-24">
              {filteredProducts.map((product) => (
                <div key={product.id} className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-foreground mb-0.5">{product.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">${product.price}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium active:scale-[0.98] transition-transform"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Movement Section */}
            <div className="pb-8">
              <h3 className="text-lg font-bold text-foreground mb-4">The Movement</h3>
              <MovementSection />
            </div>
          </motion.div>
        )}

        {activeTab === "cart" && (
          <motion.div
            key="cart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 pt-5 space-y-4"
          >
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mb-6">Browse our store to add items</p>
                <button
                  onClick={() => setActiveTab("shop")}
                  className="px-6 py-3 rounded-xl bg-foreground text-background font-medium active:scale-[0.98] transition-transform"
                >
                  Browse Store
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border shadow-sm">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">${item.product.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:scale-[0.95]"
                        >
                          <Minus className="w-4 h-4 text-foreground" />
                        </button>
                        <span className="w-6 text-center text-foreground font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item.product)}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:scale-[0.95]"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-sm">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold text-xl text-foreground">${cartTotal}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-4 rounded-xl bg-foreground text-background font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Checkout • ${cartTotal}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  100% of proceeds go to missions
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-card rounded-2xl w-full max-w-sm overflow-hidden border border-border shadow-lg"
            >
              {/* Connecting */}
              {checkoutStep === "connecting" && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-[#0052FF] animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Connecting Wallet</h3>
                  <p className="text-muted-foreground text-sm">
                    Please confirm the connection in your wallet...
                  </p>
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
                    onClick={() => {
                      resetCheckout();
                      setActiveTab("shop");
                    }}
                    className="w-full py-3 bg-foreground text-background font-semibold rounded-xl active:scale-[0.98]"
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

                  <div className="p-4 space-y-4">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-foreground">${item.product.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="text-xl font-bold text-foreground">${cartTotal}</span>
                      </div>

                      <BasePayButton 
                        fullWidth 
                        onClick={handleBasePay}
                      />
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                      100% of proceeds go to missions
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileMenuPageLayout>
  );
}
