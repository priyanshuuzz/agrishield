"""
Quick test script for AgriShield AI Backend
Run this to verify all endpoints are working
"""

import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_health():
    """Test health endpoint"""
    print('🔍 Testing health endpoint...')
    try:
        response = requests.get(f'{BASE_URL}/health', timeout=5)
        print(f'✅ Health: {response.json()}')
        return True
    except Exception as e:
        print(f'❌ Health check failed: {e}')
        return False

def test_chat():
    """Test chat endpoint"""
    print('\n🔍 Testing chat endpoint...')
    try:
        data = {
            'message': 'Kaunsi fasal best hai?',
            'context': {
                'riskScore': 45,
                'rainfall': 25,
                'temperature': 28,
                'topCrop': 'Bajra'
            }
        }
        response = requests.post(f'{BASE_URL}/chat', json=data, timeout=5)
        result = response.json()
        print(f'✅ Chat response: {result["response"]}')
        return True
    except Exception as e:
        print(f'❌ Chat test failed: {e}')
        return False

def test_risk_analysis():
    """Test risk analysis endpoint"""
    print('\n🔍 Testing risk analysis endpoint...')
    try:
        data = {
            'rainfall': 25,
            'temperature': 28,
            'soilType': 'Loamy',
            'season': 'Kharif'
        }
        response = requests.post(f'{BASE_URL}/risk-analysis', json=data, timeout=5)
        result = response.json()
        print(f'✅ Risk Score: {result["riskScore"]}')
        print(f'   Recommendations: {result["recommendations"][:2]}')
        return True
    except Exception as e:
        print(f'❌ Risk analysis test failed: {e}')
        return False

def test_crop_recommendations():
    """Test crop recommendations endpoint"""
    print('\n🔍 Testing crop recommendations endpoint...')
    try:
        data = {
            'rainfall': 25,
            'temperature': 28,
            'soilType': 'Loamy'
        }
        response = requests.post(f'{BASE_URL}/crop-recommendations', json=data, timeout=5)
        result = response.json()
        top_crops = result['crops'][:3]
        print(f'✅ Top 3 Crops:')
        for crop in top_crops:
            print(f'   - {crop["name"]}: {crop["score"]:.1f} ({crop["suitability"]})')
        return True
    except Exception as e:
        print(f'❌ Crop recommendations test failed: {e}')
        return False

def test_what_if():
    """Test what-if scenario endpoint"""
    print('\n🔍 Testing what-if scenario endpoint...')
    try:
        data = {
            'current': {
                'rainfall': 25,
                'temperature': 28,
                'riskScore': 45
            },
            'changes': {
                'rainfall': 35,
                'temperature': 30
            }
        }
        response = requests.post(f'{BASE_URL}/what-if', json=data, timeout=5)
        result = response.json()
        print(f'✅ Old Risk: {result["oldRiskScore"]} → New Risk: {result["newRiskScore"]}')
        print(f'   Impact: {result["impact"]["direction"]} by {result["impact"]["magnitude"]}')
        return True
    except Exception as e:
        print(f'❌ What-if test failed: {e}')
        return False

def test_soil_types():
    """Test soil types endpoint"""
    print('\n🔍 Testing soil types endpoint...')
    try:
        response = requests.get(f'{BASE_URL}/soil-types', timeout=5)
        result = response.json()
        print(f'✅ Soil Types: {", ".join(result["soilTypes"])}')
        return True
    except Exception as e:
        print(f'❌ Soil types test failed: {e}')
        return False

if __name__ == '__main__':
    print('=' * 60)
    print('🌾 AgriShield AI Backend Test Suite')
    print('=' * 60)
    print('\n⚠️  Make sure backend is running: python app.py\n')
    
    tests = [
        test_health,
        test_chat,
        test_risk_analysis,
        test_crop_recommendations,
        test_what_if,
        test_soil_types
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        if test():
            passed += 1
        else:
            failed += 1
    
    print('\n' + '=' * 60)
    print(f'📊 Test Results: {passed} passed, {failed} failed')
    print('=' * 60)
    
    if failed == 0:
        print('✅ All tests passed! Backend is ready for integration.')
    else:
        print('❌ Some tests failed. Check backend logs.')
