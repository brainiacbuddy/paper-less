import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Eye, Download, ArrowLeft, FileText } from "lucide-react";

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface ClientInfo {
  name: string;
  email: string;
  address: string;
}

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", name: "", description: "", quantity: 1, price: 0 }
  ]);
  
  const [client, setClient] = useState<ClientInfo>({
    name: "",
    email: "",
    address: ""
  });
  
  const [taxRate, setTaxRate] = useState(10);
  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (showPreview) {
    return <InvoicePreview 
      items={items}
      client={client}
      subtotal={calculateSubtotal()}
      tax={calculateTax()}
      total={calculateTotal()}
      taxRate={taxRate}
      onBack={() => setShowPreview(false)}
    />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">InvoicePro</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Invoice</h1>
              <p className="text-muted-foreground">Fill in the details to generate your invoice</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Enter your client's details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                placeholder="Enter client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Email Address</Label>
              <Input
                id="client-email"
                type="email"
                value={client.email}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                placeholder="Enter client email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-address">Address</Label>
              <Textarea
                id="client-address"
                value={client.address}
                onChange={(e) => setClient({ ...client, address: e.target.value })}
                placeholder="Enter client address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Settings</CardTitle>
            <CardDescription>Configure your invoice preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input
                id="invoice-number"
                defaultValue={`INV-${Date.now().toString().slice(-6)}`}
                placeholder="Enter invoice number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-date">Issue Date</Label>
              <Input
                id="issue-date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                placeholder="Enter tax rate"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice Items</CardTitle>
              <CardDescription>Add items or services to your invoice</CardDescription>
            </div>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-3 space-y-2">
                {index === 0 && <Label>Item Name</Label>}
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  placeholder="Item name"
                />
              </div>
              <div className="col-span-4 space-y-2">
                {index === 0 && <Label>Description</Label>}
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-2 space-y-2">
                {index === 0 && <Label>Quantity</Label>}
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  min="1"
                />
              </div>
              <div className="col-span-2 space-y-2">
                {index === 0 && <Label>Price ($)</Label>}
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="col-span-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Separator />
          
          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ({taxRate}%):</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoicePreview = ({ 
  items, 
  client, 
  subtotal, 
  tax, 
  total, 
  taxRate, 
  onBack 
}: {
  items: InvoiceItem[];
  client: ClientInfo;
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  onBack: () => void;
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">InvoicePro</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Invoice Preview</h1>
              <p className="text-muted-foreground">Review your invoice before saving</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack}>
                Back to Edit
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

      {/* Invoice Preview */}
      <Card className="p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-primary">INVOICE</h2>
              <p className="text-muted-foreground mt-2">INV-{Date.now().toString().slice(-6)}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-lg">InvoicePro</h3>
              <p className="text-muted-foreground">Your Business Address</p>
              <p className="text-muted-foreground">City, State, ZIP</p>
              <p className="text-muted-foreground">contact@invoicepro.com</p>
            </div>
          </div>

          {/* Client & Date Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Bill To:</h4>
              <div className="text-muted-foreground">
                <p className="font-medium text-foreground">{client.name || "Client Name"}</p>
                <p>{client.email || "client@example.com"}</p>
                <p className="whitespace-pre-line">{client.address || "Client Address"}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 font-semibold border-b pb-2">
              <div className="col-span-4">Item</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-1 text-right">Total</div>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 py-2 border-b border-border/50">
                <div className="col-span-4 font-medium">{item.name || "Item Name"}</div>
                <div className="col-span-3 text-muted-foreground">{item.description || "Description"}</div>
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-2 text-right">${item.price.toFixed(2)}</div>
                <div className="col-span-1 text-right font-medium">${(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ({taxRate}%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-end">
            <div className="text-center">
              <div className="w-24 h-24 bg-muted border border-border rounded flex items-center justify-center mb-2">
                <span className="text-xs text-muted-foreground">QR Code</span>
              </div>
              <p className="text-xs text-muted-foreground">Scan to verify</p>
            </div>
          </div>
        </div>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;