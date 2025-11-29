import { describe, it, expect } from "vitest";
import { buildIssueWorkerCardTx, buildRegisterDoorTx, buildRegisterMachineTx, buildClockInOutTx, buildAddNewAdminTx } from "../transactions";

const MOCK_ADMIN_CAP_ID = "0x123";
const MOCK_REGISTRY_ID = "0x456";
const MOCK_WORKER_CARD_ID = "0x789";
const MOCK_ADDRESS = "0xabc";

describe("Transaction Builders", () => {
    it("should build issue worker card transaction", () => {
        const tx = buildIssueWorkerCardTx(MOCK_ADMIN_CAP_ID, {
            worker_address: MOCK_ADDRESS,
            card_number: "CARD001",
            name: "John Doe",
            department: "Production",
        });

        expect(tx).toBeDefined();
        expect(tx.getData).toBeDefined();
    });

    it("should build register door transaction", () => {
        const tx = buildRegisterDoorTx(MOCK_ADMIN_CAP_ID, {
            name: "Main Entrance",
            location: "Building A",
        });

        expect(tx).toBeDefined();
        expect(tx.getData).toBeDefined();
    });

    it("should build register machine transaction", () => {
        const tx = buildRegisterMachineTx(MOCK_ADMIN_CAP_ID, {
            name: "CNC Machine",
            machine_type: "Industrial",
            location: "Factory Floor A",
        });

        expect(tx).toBeDefined();
        expect(tx.getData).toBeDefined();
    });

    it("should build clock in/out transaction", () => {
        const tx = buildClockInOutTx(MOCK_WORKER_CARD_ID, MOCK_REGISTRY_ID, 0);

        expect(tx).toBeDefined();
        expect(tx.getData).toBeDefined();
    });

    it("should build add new admin transaction", () => {
        const tx = buildAddNewAdminTx(MOCK_ADMIN_CAP_ID, MOCK_ADDRESS);

        expect(tx).toBeDefined();
        expect(tx.getData).toBeDefined();
    });
});
