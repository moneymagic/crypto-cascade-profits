
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BybitConnector from './BybitConnector';
import AccountBalances from './AccountBalances';
import OrderForm from './OrderForm';
import TradeResults from './TradeResults';
import SystemInfo from './SystemInfo';
import WebSocketMonitor from './WebSocketMonitor';
import { useBybitTrading } from '@/hooks/useBybitTrading';
import { tradingPairs } from './types';

const LiveTradingSystem: React.FC = () => {
  const {
    masterApi,
    setMasterApi,
    followerApi, 
    setFollowerApi,
    symbol,
    setSymbol,
    side,
    setSide,
    quantity,
    setQuantity,
    price,
    setPrice,
    isTradingEnabled,
    isExecuting,
    tradeResults,
    masterBalance,
    followerBalance,
    executeRealTrade,
    wsStatus,
    isListening,
    startListening,
    stopListening,
    monitoredSymbols,
    toggleSymbolMonitoring,
    fetchBalances
  } = useBybitTrading();

  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
        <CardTitle>Sistema de Trading ao Vivo - Bybit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BybitConnector
            type="master"
            onConnect={setMasterApi}
            onDisconnect={() => setMasterApi(null)}
            isConnected={!!masterApi}
          />
          <BybitConnector
            type="follower"
            onConnect={setFollowerApi}
            onDisconnect={() => setFollowerApi(null)}
            isConnected={!!followerApi}
          />
        </div>
        
        <AccountBalances 
          masterBalance={masterBalance} 
          followerBalance={followerBalance} 
          onRefreshBalances={fetchBalances}
        />
        
        <WebSocketMonitor
          wsStatus={wsStatus}
          isListening={isListening}
          isTradingEnabled={isTradingEnabled}
          onStartListening={startListening}
          onStopListening={stopListening}
          monitoredSymbols={monitoredSymbols}
          availableSymbols={tradingPairs}
          onToggleSymbol={toggleSymbolMonitoring}
        />
        
        <Tabs defaultValue="manual">
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Trading Manual</TabsTrigger>
            <TabsTrigger value="results">Histórico de Operações</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <div className="border-t pt-4">
              <OrderForm 
                symbol={symbol}
                side={side}
                quantity={quantity}
                price={price}
                isExecuting={isExecuting}
                isTradingEnabled={isTradingEnabled}
                onSymbolChange={setSymbol}
                onSideChange={setSide}
                onQuantityChange={setQuantity}
                onPriceChange={setPrice}
                onExecuteTrade={executeRealTrade}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <TradeResults tradeResults={tradeResults} />
          </TabsContent>
          
          <TabsContent value="info">
            <SystemInfo />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveTradingSystem;
