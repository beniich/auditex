import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from './useToast';

export function useLiveUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[WS] Message Received:', data);

      if (data.type === 'NODE_UPDATED') {
        const node = data.payload;
        if (node.status !== 'HEALTHY') {
          toast.error(`Infrastructure Alert: Node ${node.name} is ${node.status}`, 'Network Center');
        } else {
          toast.success(`Infrastructure Restore: Node ${node.name} is back ONLINE`, 'Network Center');
        }
        queryClient.invalidateQueries({ queryKey: ['nodes'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
      }

      if (data.type === 'NEW_INCIDENT') {
        toast.warning(`Critical Incident: ${data.payload.title}`, 'Security Center');
        queryClient.invalidateQueries({ queryKey: ['incidents'] });
      }

      if (data.type === 'INCIDENT_UPDATED') {
        queryClient.invalidateQueries({ queryKey: ['incidents'] });
      }

      if (data.type === 'COMPLIANCE_UPDATED') {
        toast.info(`Compliance Sync: Policy structure updated`, 'Governance');
        queryClient.invalidateQueries({ queryKey: ['compliance'] });
      }

      if (data.type === 'AUDIT_UPDATED') {
        queryClient.invalidateQueries({ queryKey: ['audits'] });
        queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      }
    };

    socket.onopen = () => console.log('[WS] AuditAX Live Connected');
    socket.onclose = () => console.log('[WS] AuditAX Live Disconnected');

    return () => socket.close();
  }, [queryClient]);
}
